import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string;
  assistantId: string;
  conversationId?: string;
  context?: any;
}

interface AIModel {
  name: string;
  apiUrl: string;
  headers: Record<string, string>;
  requestFormat: (prompt: string, context: any) => any;
  responseParser: (response: any) => string;
}

// AI Model configurations
const AI_MODELS: Record<string, AIModel> = {
  'gpt-3.5-turbo': {
    name: 'gpt-3.5-turbo',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    requestFormat: (prompt: string, context: any) => ({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: context.systemPrompt || 'You are a helpful AI assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
    responseParser: (response: any) => response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
  },
  'llama-2-70b': {
    name: 'llama-2-70b',
    apiUrl: 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('HUGGINGFACE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    requestFormat: (prompt: string, context: any) => ({
      inputs: `<s>[INST] <<SYS>>\n${context.systemPrompt || 'You are a helpful AI assistant.'}\n<</SYS>>\n\n${prompt} [/INST]`,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        return_full_text: false,
      }
    }),
    responseParser: (response: any) => response[0]?.generated_text || 'Sorry, I could not generate a response.'
  },
  'deepseek-v3': {
    name: 'deepseek-v3',
    apiUrl: 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-33b-instruct',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('HUGGINGFACE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    requestFormat: (prompt: string, context: any) => ({
      inputs: `### System:\n${context.systemPrompt || 'You are a helpful AI assistant.'}\n\n### User:\n${prompt}\n\n### Assistant:\n`,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        return_full_text: false,
      }
    }),
    responseParser: (response: any) => response[0]?.generated_text || 'Sorry, I could not generate a response.'
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse request body
    const { message, assistantId, conversationId, context }: ChatRequest = await req.json()

    if (!message || !assistantId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: message, assistantId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get assistant configuration
    const { data: assistant, error: assistantError } = await supabaseClient
      .from('assistants_catalog')
      .select('*')
      .eq('id', assistantId)
      .single()

    if (assistantError || !assistant) {
      return new Response(
        JSON.stringify({ error: 'Assistant not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get user's subscription and check limits
    const { data: subscription } = await supabaseClient
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Check message limits
    if (subscription) {
      const planLimits = subscription.subscription_plans
      const currentUsage = subscription.current_period_usage || {}
      const messagesThisMonth = currentUsage.messages_sent || 0

      if (planLimits.max_monthly_messages !== -1 && messagesThisMonth >= planLimits.max_monthly_messages) {
        return new Response(
          JSON.stringify({ error: 'Monthly message limit exceeded' }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // Get or create conversation
    let conversation
    if (conversationId) {
      const { data } = await supabaseClient
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()
      conversation = data
    } else {
      const { data } = await supabaseClient
        .from('conversations')
        .insert({
          user_id: user.id,
          assistant_id: assistantId,
          title: `Chat with ${assistant.name}`,
          context: context || {}
        })
        .select()
        .single()
      conversation = data
    }

    if (!conversation) {
      return new Response(
        JSON.stringify({ error: 'Failed to create or find conversation' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Store user message
    const { data: userMessage } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message,
        content_type: 'text'
      })
      .select()
      .single()

    // Get conversation history for context
    const { data: messageHistory } = await supabaseClient
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(10)

    // Determine which AI model to use based on subscription
    let modelToUse = 'deepseek-v3' // Default to free model
    if (subscription?.subscription_plans?.allowed_ai_models) {
      const allowedModels = subscription.subscription_plans.allowed_ai_models
      // Use the best available model
      if (allowedModels.includes('gpt-4')) {
        modelToUse = 'gpt-4'
      } else if (allowedModels.includes('gpt-3.5-turbo')) {
        modelToUse = 'gpt-3.5-turbo'
      } else if (allowedModels.includes('llama-2-70b')) {
        modelToUse = 'llama-2-70b'
      }
    }

    // Prepare context for AI
    const aiContext = {
      systemPrompt: assistant.system_prompt,
      assistantPersonality: assistant.personality,
      userProfile: context?.userProfile || {},
      conversationHistory: messageHistory || [],
      assistantId: assistantId
    }

    // Generate AI response
    const startTime = Date.now()
    let aiResponse: string
    let tokensUsed = 0
    let cost = 0

    try {
      const model = AI_MODELS[modelToUse]
      if (!model) {
        throw new Error(`Model ${modelToUse} not configured`)
      }

      const requestBody = model.requestFormat(message, aiContext)
      
      const response = await fetch(model.apiUrl, {
        method: 'POST',
        headers: model.headers,
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`AI API Error: ${response.status} - ${errorText}`)
        throw new Error(`AI API returned ${response.status}`)
      }

      const responseData = await response.json()
      aiResponse = model.responseParser(responseData)
      
      // Calculate tokens and cost (simplified)
      tokensUsed = Math.ceil(aiResponse.length / 4) // Rough token estimation
      cost = tokensUsed * 0.0001 // Simplified cost calculation

    } catch (error) {
      console.error('AI API Error:', error)
      aiResponse = `I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment.`
    }

    const processingTime = Date.now() - startTime

    // Store AI response
    const { data: aiMessage } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: aiResponse,
        content_type: 'text',
        tokens_used: tokensUsed,
        processing_time: processingTime,
        model_used: modelToUse,
        cost: cost
      })
      .select()
      .single()

    // Update subscription usage
    if (subscription) {
      const currentUsage = subscription.current_period_usage || {}
      const updatedUsage = {
        ...currentUsage,
        messages_sent: (currentUsage.messages_sent || 0) + 1,
        ai_tokens_used: (currentUsage.ai_tokens_used || 0) + tokensUsed,
        total_cost: (currentUsage.total_cost || 0) + cost
      }

      await supabaseClient
        .from('user_subscriptions')
        .update({ current_period_usage: updatedUsage })
        .eq('id', subscription.id)
    }

    // Update assistant interaction stats
    await supabaseClient.rpc('increment_assistant_interactions', {
      user_uuid: user.id,
      assistant_id: assistantId
    })

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        message: {
          id: aiMessage?.id,
          content: aiResponse,
          role: 'assistant',
          created_at: aiMessage?.created_at,
          processing_time: processingTime,
          model_used: modelToUse,
          tokens_used: tokensUsed
        },
        conversation: {
          id: conversation.id,
          title: conversation.title
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
