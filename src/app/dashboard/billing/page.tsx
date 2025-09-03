"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Crown, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Bot,
  Clock,
  Shield,
  Star
} from 'lucide-react';

export default function BillingPage() {
  const [currentPlan] = useState('professional');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfecto para emprendedores individuales',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        '3 Asistentes IA especializados',
        '1,000 mensajes por mes',
        'Automatizaciones básicas',
        'Soporte por email',
        'Dashboard básico'
      ],
      limitations: [
        'Sin integración WhatsApp',
        'Sin análisis avanzado',
        'Sin API access'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal para pequeñas y medianas empresas',
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        '6 Asistentes IA especializados',
        '10,000 mensajes por mes',
        'Automatizaciones avanzadas',
        'Integración WhatsApp',
        'Analytics completo',
        'Soporte prioritario',
        'Cerebro AI avanzado',
        'Exportación de datos'
      ],
      limitations: [
        'Sin modelos premium (GPT-4)',
        'Sin white-label'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Para empresas grandes con necesidades específicas',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        '12 Asistentes IA especializados',
        'Mensajes ilimitados',
        'Modelos premium (GPT-4, Claude)',
        'Integraciones personalizadas',
        'API completa',
        'White-label disponible',
        'Soporte dedicado 24/7',
        'Configuración empresarial',
        'SLA garantizado'
      ],
      limitations: [],
      popular: false
    }
  ];

  const usageStats = {
    messages: { used: 3247, limit: 10000 },
    assistants: { used: 3, limit: 6 },
    automations: { used: 12, limit: 50 },
    storage: { used: 1.2, limit: 10 }
  };

  const recentInvoices = [
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: 79,
      status: 'paid',
      description: 'Plan Professional - Enero 2024'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-01',
      amount: 79,
      status: 'paid',
      description: 'Plan Professional - Diciembre 2023'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-01',
      amount: 79,
      status: 'paid',
      description: 'Plan Professional - Noviembre 2023'
    }
  ];

  const getPrice = (plan: any) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
  };

  const getSavings = (plan: any) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    return Math.round((savings / monthlyTotal) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Suscripción y Facturación</h1>
            <p className="text-gray-600">Gestiona tu plan y revisa tu uso</p>
          </div>
        </div>
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Crown className="h-3 w-3 mr-1" />
          Plan Professional
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Planes</TabsTrigger>
          <TabsTrigger value="usage">Uso</TabsTrigger>
          <TabsTrigger value="billing">Facturación</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  Plan Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Professional</h3>
                    <p className="text-gray-600">Perfecto para tu negocio</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$79</p>
                    <p className="text-sm text-gray-600">USD/mes</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Próxima renovación</span>
                    <span className="font-medium">15 Feb 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Método de pago</span>
                    <span className="font-medium">•••• 4242</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Actualizar Plan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Uso del Mes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Mensajes</span>
                    <span className="text-sm font-medium">
                      {usageStats.messages.used.toLocaleString()} / {usageStats.messages.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(usageStats.messages.used / usageStats.messages.limit) * 100} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Asistentes Activos</span>
                    <span className="text-sm font-medium">
                      {usageStats.assistants.used} / {usageStats.assistants.limit}
                    </span>
                  </div>
                  <Progress value={(usageStats.assistants.used / usageStats.assistants.limit) * 100} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Automatizaciones</span>
                    <span className="text-sm font-medium">
                      {usageStats.automations.used} / {usageStats.automations.limit}
                    </span>
                  </div>
                  <Progress value={(usageStats.automations.used / usageStats.automations.limit) * 100} />
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600">
                    Renovación en 12 días. El uso se reinicia el 15 de cada mes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente de Facturación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentInvoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.description}</p>
                        <p className="text-sm text-gray-600">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${invoice.amount}</p>
                      <Badge variant="secondary" className="text-xs">
                        {invoice.status === 'paid' ? 'Pagado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLANS TAB */}
        <TabsContent value="plans" className="space-y-4">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
            <span className={billingPeriod === 'monthly' ? 'font-medium' : 'text-gray-600'}>Mensual</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative"
            >
              <div className={`w-12 h-6 rounded-full transition-colors ${
                billingPeriod === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </Button>
            <span className={billingPeriod === 'yearly' ? 'font-medium' : 'text-gray-600'}>
              Anual
              {billingPeriod === 'yearly' && (
                <Badge variant="secondary" className="ml-2 text-xs">20% off</Badge>
              )}
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${
                plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''
              } ${currentPlan === plan.id ? 'bg-blue-50' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Más Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">${getPrice(plan)}</span>
                      <span className="text-gray-600">/{billingPeriod === 'monthly' ? 'mes' : 'mes'}</span>
                      {billingPeriod === 'yearly' && (
                        <p className="text-sm text-green-600 font-medium">
                          Ahorra {getSavings(plan)}% anual
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-2 border-t space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-500">
                          <span className="text-sm">• {limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    className="w-full mt-4"
                    variant={currentPlan === plan.id ? 'secondary' : 'default'}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id ? 'Plan Actual' : 'Seleccionar Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* USAGE TAB */}
        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Uso de Asistentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Sofía (Social Media)</span>
                    <span className="text-sm font-medium">1,247 mensajes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Carlos (Customer Support)</span>
                    <span className="text-sm font-medium">892 mensajes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Paula (Copywriter)</span>
                    <span className="text-sm font-medium">1,108 mensajes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Automatizaciones Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Respuestas automáticas</span>
                    <span className="text-sm font-medium">5 activas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Publicaciones programadas</span>
                    <span className="text-sm font-medium">3 activas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Análisis de métricas</span>
                    <span className="text-sm font-medium">4 activas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Límites del Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(usageStats).map(([key, stat]) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm capitalize">{key}</span>
                    <span className="text-sm font-medium">
                      {typeof stat.used === 'number' && stat.used < 10 
                        ? stat.used 
                        : stat.used.toLocaleString()} / {stat.limit.toLocaleString()}
                      {key === 'storage' && ' GB'}
                    </span>
                  </div>
                  <Progress value={(stat.used / stat.limit) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* BILLING TAB */}
        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Visa terminada en 4242</p>
                      <p className="text-sm text-gray-600">Vence 12/2025</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Principal</Badge>
                </div>
                
                <Button variant="outline" className="w-full">
                  Actualizar Método de Pago
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próxima Facturación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold">$79.00</p>
                  <p className="text-sm text-gray-600">Se cobrará el 15 Feb 2024</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Plan Professional</span>
                    <span>$79.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>$79.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Historial de Facturas</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Todo
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.description}</p>
                      <p className="text-sm text-gray-600">{invoice.id} • {invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount}.00</p>
                        <Badge variant={invoice.status === 'paid' ? 'secondary' : 'destructive'}>
                          {invoice.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
