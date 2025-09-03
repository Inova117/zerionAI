"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  Smartphone,
  Workflow,
  Languages,
  HeadphonesIcon,
  Sparkles
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "Cerebro AI Personalizado",
      description: "Cada asistente aprende sobre tu negocio específico. Sube documentos, URLs y información para respuestas más precisas.",
      benefits: ["Memoria empresarial", "Contexto personalizado", "Mejora continua"],
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: "Automatización 24/7",
      description: "Tus asistentes trabajan mientras duermes. Programan posts, responden clientes y generan reportes automáticamente.",
      benefits: ["Trabajo nocturno", "Cero supervisión", "Productividad continua"],
      color: "text-yellow-600"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Business Nativo",
      description: "Integración completa con WhatsApp Business API. Respuestas automáticas, catálogos y gestión de pedidos.",
      benefits: ["API oficial", "Respuestas automáticas", "Gestión de catálogo"],
      color: "text-green-600"
    },
    {
      icon: Globe,
      title: "Optimizado para LATAM",
      description: "Conoce las culturas, fechas importantes, métodos de pago y plataformas populares de cada país latinoamericano.",
      benefits: ["Cultura local", "Métodos de pago", "Festividades regionales"],
      color: "text-blue-600"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Dashboards en tiempo real con métricas de cada asistente. Ve el ROI de cada automatización y optimiza continuamente.",
      benefits: ["Métricas en tiempo real", "ROI por asistente", "Optimización continua"],
      color: "text-indigo-600"
    },
    {
      icon: Shield,
      title: "Seguridad Empresarial",
      description: "Cumplimiento LGPD, encriptación end-to-end y servidores en LATAM. Tus datos nunca salen de la región.",
      benefits: ["LGPD compliant", "Encriptación E2E", "Servidores locales"],
      color: "text-red-600"
    }
  ];

  const integrations = [
    { name: "WhatsApp", icon: "💬" },
    { name: "Instagram", icon: "📸" },
    { name: "Facebook", icon: "👥" },
    { name: "Gmail", icon: "📧" },
    { name: "Shopify", icon: "🛒" },
    { name: "Mercado Libre", icon: "🛍️" },
    { name: "Google Analytics", icon: "📊" },
    { name: "Stripe", icon: "💳" }
  ];

  const comparisons = [
    {
      title: "vs. ChatGPT/Claude",
      features: [
        "✅ Memoria empresarial persistente",
        "✅ Especialistas por función",
        "✅ Automatización de tareas",
        "✅ Integración con herramientas",
        "❌ ChatGPT: Solo conversaciones genéricas"
      ]
    },
    {
      title: "vs. Contratar empleados",
      features: [
        "✅ Disponible 24/7 sin descansos",
        "✅ Costo fijo mensual predecible",
        "✅ No necesita capacitación",
        "✅ Escala instantáneamente",
        "❌ Empleados: Costos variables y limitaciones"
      ]
    },
    {
      title: "vs. Herramientas separadas",
      features: [
        "✅ Una sola plataforma integrada",
        "✅ Datos centralizados",
        "✅ Workflows coordinados",
        "✅ Un solo login y facturación",
        "❌ Múltiples tools: Fragmentación y costos"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Características Principales
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Más que un chatbot,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> un equipo completo</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Diseñado específicamente para pequeñas y medianas empresas en América Latina. 
            Cada característica pensada para maximizar tu productividad.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Section */}
        <div className="bg-white rounded-2xl p-8 mb-20 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Se integra con tus herramientas favoritas
            </h3>
            <p className="text-gray-600">
              Conecta automáticamente con las plataformas que ya usas. Sin configuración compleja.
            </p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                  {integration.icon}
                </div>
                <p className="text-xs text-gray-600 font-medium">{integration.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir nuestros asistentes?
            </h3>
            <p className="text-gray-600">
              Comparamos con las alternativas más populares para que veas la diferencia
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {comparisons.map((comparison, index) => (
              <Card key={index} className="bg-white border-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 text-center">
                    {comparison.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comparison.features.map((feature, idx) => (
                      <div key={idx} className={`text-sm ${
                        feature.startsWith('✅') ? 'text-green-700' : 'text-red-600'
                      }`}>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "90%", label: "Reducción en costos operativos" },
              { number: "24/7", label: "Disponibilidad sin interrupciones" },
              { number: "5min", label: "Tiempo de configuración inicial" },
              { number: "100+", label: "Automatizaciones disponibles" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
