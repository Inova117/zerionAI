import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      return new Response('Missing signature or webhook secret', { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(supabaseAdmin, subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancelled(supabaseAdmin, subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(supabaseAdmin, invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(supabaseAdmin, invoice)
        break
      }

      case 'customer.created':
      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer
        await handleCustomerUpdate(supabaseAdmin, customer)
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function handleSubscriptionUpdate(supabaseAdmin: any, subscription: Stripe.Subscription) {
  try {
    // Get customer and find associated user
    const customer = await stripe.customers.retrieve(subscription.customer as string)
    
    if (!customer || customer.deleted) {
      console.error('Customer not found for subscription:', subscription.id)
      return
    }

    const email = (customer as Stripe.Customer).email
    if (!email) {
      console.error('No email found for customer:', customer.id)
      return
    }

    // Find user by email
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!profile) {
      console.error('User not found for email:', email)
      return
    }

    // Get price and determine plan
    const priceId = subscription.items.data[0]?.price.id
    const planId = await getPlanIdFromPriceId(priceId)

    if (!planId) {
      console.error('Plan not found for price ID:', priceId)
      return
    }

    // Update or create subscription
    const subscriptionData = {
      user_id: profile.id,
      plan_id: planId,
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      status: mapStripeStatus(subscription.status),
      billing_cycle: subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString().split('T')[0],
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
      current_period_usage: {}
    }

    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'stripe_subscription_id'
      })

    if (error) {
      console.error('Error updating subscription:', error)
    } else {
      console.log('Subscription updated successfully for user:', profile.id)
    }

  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

async function handleSubscriptionCancelled(supabaseAdmin: any, subscription: Stripe.Subscription) {
  try {
    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        ended_at: new Date(subscription.canceled_at! * 1000).toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('Error cancelling subscription:', error)
    } else {
      console.log('Subscription cancelled successfully:', subscription.id)
    }

  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}

async function handleInvoicePaymentSucceeded(supabaseAdmin: any, invoice: Stripe.Invoice) {
  try {
    // Get subscription
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('stripe_subscription_id', invoice.subscription)
      .single()

    if (!subscription) {
      console.error('Subscription not found for invoice:', invoice.id)
      return
    }

    // Create or update invoice record
    const invoiceData = {
      user_subscription_id: subscription.id,
      invoice_number: invoice.number || `INV-${Date.now()}`,
      stripe_invoice_id: invoice.id,
      subtotal: invoice.subtotal / 100, // Convert from cents
      tax_amount: (invoice.tax || 0) / 100,
      discount_amount: (invoice.discount?.amount || 0) / 100,
      total_amount: invoice.total / 100,
      currency: invoice.currency.toUpperCase(),
      status: 'paid',
      issue_date: new Date(invoice.created * 1000).toISOString().split('T')[0],
      due_date: new Date(invoice.due_date! * 1000).toISOString().split('T')[0],
      paid_date: new Date().toISOString().split('T')[0],
      line_items: invoice.lines.data.map(line => ({
        description: line.description,
        amount: line.amount / 100,
        quantity: line.quantity,
        price_id: line.price?.id
      })),
      pdf_url: invoice.invoice_pdf
    }

    const { error } = await supabaseAdmin
      .from('invoices')
      .upsert(invoiceData, {
        onConflict: 'stripe_invoice_id'
      })

    if (error) {
      console.error('Error creating invoice:', error)
    } else {
      console.log('Invoice created successfully:', invoice.id)
    }

    // Reset usage for new billing period if this is a subscription invoice
    if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
      await supabaseAdmin
        .from('user_subscriptions')
        .update({
          current_period_usage: {},
          current_period_start: new Date(invoice.period_start! * 1000).toISOString().split('T')[0],
          current_period_end: new Date(invoice.period_end! * 1000).toISOString().split('T')[0]
        })
        .eq('stripe_subscription_id', invoice.subscription)
    }

  } catch (error) {
    console.error('Error handling invoice payment success:', error)
  }
}

async function handleInvoicePaymentFailed(supabaseAdmin: any, invoice: Stripe.Invoice) {
  try {
    // Update subscription status to past_due
    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .update({ status: 'past_due' })
      .eq('stripe_subscription_id', invoice.subscription)

    if (error) {
      console.error('Error updating subscription to past_due:', error)
    } else {
      console.log('Subscription marked as past_due:', invoice.subscription)
    }

    // TODO: Send notification email to user about failed payment

  } catch (error) {
    console.error('Error handling invoice payment failure:', error)
  }
}

async function handleCustomerUpdate(supabaseAdmin: any, customer: Stripe.Customer) {
  try {
    if (!customer.email) return

    // Update profile with customer information
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: customer.name,
        phone: customer.phone,
        updated_at: new Date().toISOString()
      })
      .eq('email', customer.email)

    if (error) {
      console.error('Error updating customer profile:', error)
    } else {
      console.log('Customer profile updated:', customer.email)
    }

  } catch (error) {
    console.error('Error handling customer update:', error)
  }
}

async function getPlanIdFromPriceId(priceId: string): Promise<string | null> {
  // Map Stripe price IDs to plan IDs
  // This would be stored in environment variables or database in production
  const priceToPlans: Record<string, string> = {
    // Monthly prices
    'price_starter_monthly': 'starter',
    'price_professional_monthly': 'professional', 
    'price_enterprise_monthly': 'enterprise',
    // Yearly prices
    'price_starter_yearly': 'starter',
    'price_professional_yearly': 'professional',
    'price_enterprise_yearly': 'enterprise'
  }

  return priceToPlans[priceId] || null
}

function mapStripeStatus(stripeStatus: string): string {
  const statusMap: Record<string, string> = {
    'active': 'active',
    'past_due': 'past_due',
    'unpaid': 'unpaid',
    'canceled': 'cancelled',
    'incomplete': 'trial',
    'incomplete_expired': 'cancelled',
    'trialing': 'trial'
  }

  return statusMap[stripeStatus] || 'cancelled'
}
