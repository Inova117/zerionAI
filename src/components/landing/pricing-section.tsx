"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Building, Sparkles } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "Emprendedor",
      price: "$29",
      originalPrice: "$59",
      period: "/mes",
      description: "Perfecto para solopreneurs y pequeños negocios",
      icon: Zap,
      color: "border-gray-200",
      buttonColor: "bg-gray-900 hover:bg-gray-800",
      features: [
        "3 asistentes de tu elección",
        "1,000 tareas automáticas/mes",
        "Integración con WhatsApp",
        "Soporte por email",
        "Dashboard básico",
        "Cerebro AI (500MB)",
        "Plantillas predefinidas"
      ],
      popular: false
    },
    {
      name: "Profesional",
      price: "$59",
      originalPrice: "$119",
      period: "/mes",
      description: "Para equipos y empresas en crecimiento",
      icon: Crown,
      color: "border-blue-500 shadow-blue-200 shadow-lg",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      features: [
        "Todos los 12 asistentes",
        "5,000 tareas automáticas/mes",
        "Todas las integraciones",
        "Soporte prioritario",
        "Analytics avanzados",
        "Cerebro AI (2GB)",
        "Workflows personalizados",
        "API access",
        "Colaboración en equipo"
      ],
      popular: true
    },
    {
      name: "Empresarial",
      price: "$129",
      originalPrice: "$259",
      period: "/mes",
      description: "Para empresas que quieren máximo rendimiento",
      icon: Building,
      color: "border-purple-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      features: [
        "Todo del plan Profesional",
        "Tareas ilimitadas",
        "Asistentes personalizados",
        "Gerente de éxito dedicado",
        "Integración por webhook",
        "Cerebro AI ilimitado",
        "White-label disponible",
        "SLA garantizado 99.9%",
        "Capacitación personalizada"
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer: "Sí, puedes upgrade o downgrade tu plan cuando quieras. Los cambios se aplican inmediatamente."
    },
    {
      question: "¿Qué pasa si supero el límite de tareas?",
      answer: "Te notificamos cuando estés cerca del límite. Puedes comprar packs adicionales o hacer upgrade a un plan superior."
    },
    {
      question: "¿Hay descuentos para pagos anuales?",
      answer: "Sí, con el pago anual obtienes 40% de descuento (2 meses gratis)."
    },
    {
      question: "¿Funciona en todos los países de LATAM?",
      answer: "Sí, tenemos optimizaciones específicas para México, Brasil, Colombia, Argentina, Chile y más países."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Precios Especiales para LATAM
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Planes que se adaptan
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> a tu presupuesto</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Precios especiales para América Latina. Empieza gratis por 14 días, sin tarjeta de crédito.
          </p>
          
          {/* Discount Banner */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-4 inline-block mb-8">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm font-bold">🔥 OFERTA DE LANZAMIENTO</span>
              <span className="text-sm">50% OFF los primeros 3 meses</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'scale-105' : ''} transition-all duration-300 hover:shadow-xl`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center`}>
                  <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  {plan.description}
                </CardDescription>
                
                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <div className="text-left">
                      <div className="text-lg text-gray-500 line-through">{plan.originalPrice}</div>
                      <div className="text-sm text-gray-600">{plan.period}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Después $59/mes</p>
                </div>
              </CardHeader>

              <CardContent>
                <Button 
                  className={`w-full mb-6 ${plan.buttonColor} text-white font-semibold py-3`}
                  size="lg"
                >
                  {plan.popular ? "Empieza Gratis" : "Probar Gratis"}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.popular && (
                  <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium text-center">
                      💡 Plan recomendado para la mayoría de empresas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Necesitas algo más específico?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Para empresas grandes, franquicias o casos especiales, creamos planes personalizados 
            con asistentes hechos a medida para tu industria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="border-2">
              Hablar con Ventas
            </Button>
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
              Ver Demo Personalizado
            </Button>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-16 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Garantía de devolución de 30 días
          </h3>
          <p className="text-gray-600">
            Si no ves resultados en los primeros 30 días, te devolvemos el 100% de tu dinero. Sin preguntas.
          </p>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Preguntas frecuentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-3">{faq.question}</h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Empezar mi prueba gratuita de 14 días
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            No se requiere tarjeta de crédito • Cancela cuando quieras • Soporte en español
          </p>
        </div>
      </div>
    </section>
  );
}
