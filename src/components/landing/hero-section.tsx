"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, Clock, Globe } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <Badge 
            variant="secondary" 
            className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Tu equipo de IA que nunca duerme
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Tus asistentes de IA
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            que nunca duermen
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Comienza con los 3 asistentes más esenciales: marketing, soporte y copywriting. 
          El equipo perfecto para impulsar tu negocio, disponible 24/7 en español.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm sm:text-base">
          <div className="flex items-center text-gray-700">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            <span className="font-semibold">3 Asistentes Principales</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            <span className="font-semibold">24/7 Disponibles</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Globe className="w-5 h-5 mr-2 text-purple-600" />
            <span className="font-semibold">100+ Idiomas</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={() => window.location.href = '/dashboard'}
          >
            Ver Dashboard Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
          >
            Ver Demo en Vivo
          </Button>
        </div>

        {/* Demo Preview */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Browser Bar */}
            <div className="bg-gray-50 px-4 py-3 flex items-center border-b border-gray-200">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="bg-white rounded-md px-3 py-1 text-sm text-gray-600 inline-block">
                  asistentes-ai.com/dashboard
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Assistant Cards Preview */}
                {[
                  { name: "Sofía", role: "Social Media", emoji: "👩‍💼", color: "bg-pink-100" },
                  { name: "Carlos", role: "Soporte", emoji: "🙋‍♂️", color: "bg-blue-100" },
                  { name: "Paula", role: "Copywriter", emoji: "✍️", color: "bg-red-100" }
                ].map((assistant, index) => (
                  <div key={index} className={`${assistant.color} p-4 rounded-lg text-center transform hover:scale-105 transition-transform duration-200 cursor-pointer`}>
                    <div className="text-2xl mb-2">{assistant.emoji}</div>
                    <div className="font-semibold text-sm text-gray-800">{assistant.name}</div>
                    <div className="text-xs text-gray-600">{assistant.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -left-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-bounce">
            ✓ En línea
          </div>
          <div className="absolute -top-4 -right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-bounce" style={{ animationDelay: "0.5s" }}>
            💬 Conversando
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-4">Confiado por más de 1,000 empresas en LATAM</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Placeholder for company logos */}
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
