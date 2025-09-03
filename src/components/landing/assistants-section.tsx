"use client";

import { assistants } from "@/lib/assistants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function AssistantsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-purple-100 text-purple-800">
              <Sparkles className="w-4 h-4 mr-2" />
              3 Especialistas Principales
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Conoce a tus
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> 3 asistentes principales</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comenzamos con los 3 asistentes más esenciales para cualquier negocio. 
            Cada uno está entrenado específicamente para dominar su área de expertise.
          </p>
        </div>

        {/* Assistants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {assistants.map((assistant, index) => (
            <Card 
              key={assistant.id} 
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 hover:border-blue-200"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${assistant.color} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                  {assistant.avatar}
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {assistant.name}
                </CardTitle>
                <CardDescription className="text-sm font-medium text-gray-600">
                  {assistant.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {assistant.description}
                </p>
                
                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {assistant.specialties.slice(0, 2).map((specialty, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-xs px-2 py-1"
                      >
                        {specialty}
                      </Badge>
                    ))}
                    {assistant.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        +{assistant.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Example Task */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Ejemplo de tarea:</p>
                  <p className="text-xs text-gray-800 font-medium">
                    "{assistant.examples[0]}"
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Disponible 24/7
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Chatear
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why These 3 Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ¿Por qué estos 3 asistentes?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Marketing Essential",
                description: "Sofía maneja todo tu contenido y presencia online",
                icon: "📱",
                color: "bg-pink-500",
                benefits: ["Contenido viral", "Programación automática", "Gestión de comunidad"]
              },
              {
                title: "Soporte 24/7",
                description: "Carlos atiende a tus clientes cuando no estás disponible",
                icon: "🎧",
                color: "bg-blue-500",
                benefits: ["WhatsApp automático", "Respuestas inteligentes", "Escalación rápida"]
              },
              {
                title: "Copywriting Pro",
                description: "Paula escribe textos que realmente convierten y venden",
                icon: "✍️",
                color: "bg-purple-500",
                benefits: ["Copy persuasivo", "Email marketing", "Landing pages"]
              }
            ].map((category, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${category.color} flex items-center justify-center`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">{category.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center justify-center text-xs text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={() => window.location.href = '/dashboard'}
          >
            Probar mis 3 asistentes
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Más asistentes disponibles próximamente
          </p>
        </div>
      </div>
    </section>
  );
}
