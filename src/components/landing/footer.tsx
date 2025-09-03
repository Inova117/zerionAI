"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MessageCircle, 
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Heart,
  Shield,
  Check,
  Award,
  Globe
} from "lucide-react";

export function Footer() {
  const footerSections = [
    {
      title: "Producto",
      links: [
        "Todos los Asistentes",
        "Cerebro AI",
        "Integraciones",
        "Power-Ups",
        "Precios",
        "Demo en Vivo"
      ]
    },
    {
      title: "Empresa",
      links: [
        "Sobre Nosotros",
        "Carreras",
        "Blog",
        "Casos de Éxito",
        "Prensa",
        "Afiliados"
      ]
    },
    {
      title: "Soporte",
      links: [
        "Centro de Ayuda",
        "Documentación",
        "API Docs",
        "Estado del Sistema",
        "Contáctanos",
        "Reportar Bug"
      ]
    },
    {
      title: "Legal",
      links: [
        "Términos de Servicio",
        "Política de Privacidad",
        "LGPD Compliance",
        "Cookies",
        "Reembolsos",
        "SLA"
      ]
    }
  ];

  const countries = [
    { name: "México", flag: "🇲🇽", available: true },
    { name: "Brasil", flag: "🇧🇷", available: true },
    { name: "Colombia", flag: "🇨🇴", available: true },
    { name: "Argentina", flag: "🇦🇷", available: true },
    { name: "Chile", flag: "🇨🇱", available: true },
    { name: "Perú", flag: "🇵🇪", available: false },
    { name: "Uruguay", flag: "🇺🇾", available: false },
    { name: "Ecuador", flag: "🇪🇨", available: false }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Mantente al día con las últimas actualizaciones
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Nuevos asistentes, integraciones y características exclusivas para suscriptores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6">
              Suscribirme
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">AI</span>
                </div>
                <h3 className="text-xl font-bold">Asistentes LATAM</h3>
              </div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Tu equipo de asistentes de IA especializado para América Latina. 
                Automatiza tu negocio con tecnología de punta adaptada a nuestra región.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>hola@asistentes-ai.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MessageCircle className="w-4 h-4 mr-3" />
                  <span>WhatsApp: +52 55 1234 5678</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>Ciudad de México, México</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {[Twitter, Instagram, Linkedin, Facebook, Youtube].map((Icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Countries Section */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <h4 className="font-semibold mb-6 text-center">Países donde operamos</h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {countries.map((country, index) => (
                <div 
                  key={index} 
                  className={`text-center ${country.available ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className="text-2xl mb-2">{country.flag}</div>
                  <div className="text-xs text-gray-400">{country.name}</div>
                  {country.available ? (
                    <Badge variant="secondary" className="text-xs mt-1 bg-green-900 text-green-400">
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs mt-1 bg-gray-800 text-gray-500">
                      Pronto
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap justify-center items-center space-x-8 opacity-60">
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 mr-2" />
                <span>LGPD Compliant</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 mr-2" />
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Award className="w-4 h-4 mr-2" />
                <span>SOC 2 Type II</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Globe className="w-4 h-4 mr-2" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Asistentes LATAM. Todos los derechos reservados.
            </div>
            
            <div className="flex items-center text-sm text-gray-400">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span>para América Latina</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
