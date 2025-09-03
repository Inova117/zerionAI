"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Video, 
  Mail,
  Phone,
  Clock,
  CheckCircle,
  ExternalLink,
  Play,
  Download,
  Star,
  Send
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const faqItems = [
    {
      category: 'Primeros Pasos',
      questions: [
        {
          q: '¿Cómo empiezo a usar mis asistentes IA?',
          a: 'Simplemente ve al Dashboard y haz clic en cualquiera de los 3 asistentes principales: Sofía (Social Media), Carlos (Customer Support), o Paula (Copywriter). Cada uno tiene su especialidad y puede ayudarte inmediatamente.'
        },
        {
          q: '¿Qué hace cada asistente exactamente?',
          a: 'Sofía se especializa en redes sociales (contenido, programación, tendencias), Carlos en atención al cliente (WhatsApp, FAQ, soporte), y Paula en copywriting (textos persuasivos, landing pages, emails de venta).'
        },
        {
          q: '¿Los asistentes recuerdan nuestras conversaciones?',
          a: 'Sí, cada asistente tiene memoria contextual completa. Recuerdan tu empresa, objetivos, conversaciones previas y van aprendiendo tus preferencias para dar respuestas cada vez más personalizadas.'
        }
      ]
    },
    {
      category: 'Funcionalidades',
      questions: [
        {
          q: '¿Qué es el "Cerebro AI" y cómo funciona?',
          a: 'El Cerebro AI es el centro de conocimiento que conecta todos tus asistentes. Almacena tu perfil empresarial, insights descubiertos, patrones de comportamiento y métricas. Puedes accederlo desde el sidebar.'
        },
        {
          q: '¿Cómo funcionan las automatizaciones?',
          a: 'Las automatizaciones trabajan 24/7 en segundo plano. Pueden programar posts, responder consultas frecuentes, analizar métricas, y realizar tareas repetitivas mientras tú te enfocas en lo estratégico.'
        },
        {
          q: '¿Puedo integrar WhatsApp Business?',
          a: 'Sí, en el plan Professional y Enterprise puedes conectar WhatsApp Business para que Carlos maneje automáticamente consultas de clientes, con respuestas inteligentes y escalación cuando sea necesario.'
        }
      ]
    },
    {
      category: 'Facturación y Planes',
      questions: [
        {
          q: '¿Puedo cambiar de plan en cualquier momento?',
          a: 'Sí, puedes actualizar o degradar tu plan cuando quieras. Los cambios se aplican inmediatamente y ajustamos la facturación proporcionalmente.'
        },
        {
          q: '¿Hay límite en los mensajes?',
          a: 'Depende del plan: Starter (1,000/mes), Professional (10,000/mes), Enterprise (ilimitado). Los mensajes se reinician cada mes en tu fecha de renovación.'
        },
        {
          q: '¿Ofrecen garantía de reembolso?',
          a: 'Sí, ofrecemos 30 días de garantía completa. Si no estás satisfecho, te devolvemos el 100% sin preguntas.'
        }
      ]
    },
    {
      category: 'Problemas Técnicos',
      questions: [
        {
          q: 'Mi asistente no responde o responde lento',
          a: 'Esto puede deberse a alta demanda en los servidores. Generalmente se resuelve en 1-2 minutos. Si persiste, contáctanos en soporte@sintra-latam.com'
        },
        {
          q: '¿Cómo exporto mis datos y conversaciones?',
          a: 'Ve a Configuración > Privacidad y Datos > "Exportar Mis Datos". Recibirás un archivo JSON con toda tu información, conversaciones e insights.'
        },
        {
          q: '¿Los datos están seguros?',
          a: 'Sí, usamos encriptación AES-256, todos los datos se almacenan en servidores certificados SOC2, y nunca compartimos información personal con terceros.'
        }
      ]
    }
  ];

  const resources = [
    {
      title: 'Guía de Inicio Rápido',
      description: 'Todo lo que necesitas saber para empezar en 10 minutos',
      type: 'guide',
      duration: '10 min',
      icon: Book
    },
    {
      title: 'Video: Configurando tu Primer Asistente',
      description: 'Tutorial paso a paso para configurar Sofía para tu negocio',
      type: 'video',
      duration: '8 min',
      icon: Video
    },
    {
      title: 'Mejores Prácticas para Automatizaciones',
      description: 'Cómo configurar automatizaciones que realmente funcionen',
      type: 'guide',
      duration: '15 min',
      icon: Book
    },
    {
      title: 'Webinar: Maximiza tu ROI con IA',
      description: 'Estrategias avanzadas para sacar el máximo provecho',
      type: 'video',
      duration: '45 min',
      icon: Video
    }
  ];

  const filteredFAQ = faqItems.map(category => ({
    ...category,
    questions: category.questions.filter(item =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated form submission
    alert('Tu mensaje ha sido enviado. Te responderemos en menos de 24 horas.');
    setContactForm({ subject: '', message: '', priority: 'medium' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HelpCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Centro de Ayuda</h1>
            <p className="text-gray-600">Encuentra respuestas, tutoriales y soporte técnico</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          <Clock className="h-3 w-3 mr-1" />
          Soporte 24/7
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar en el centro de ayuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-base"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Guías
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Contacto
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Estado
          </TabsTrigger>
        </TabsList>

        {/* FAQ TAB */}
        <TabsContent value="faq" className="space-y-4">
          {filteredFAQ.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600">
                  Intenta con otros términos de búsqueda o contacta soporte directamente
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQ.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {category.questions.map((item, index) => (
                      <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* GUIDES TAB */}
        <TabsContent value="guides" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <resource.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {resource.duration}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          {resource.type === 'video' ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <ExternalLink className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Documentación Completa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Book className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Manual del Usuario Completo</p>
                    <p className="text-sm text-gray-600">Guía exhaustiva de todas las funcionalidades</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Serie de Tutoriales en Video</p>
                    <p className="text-sm text-gray-600">12 videos que cubren desde básico hasta avanzado</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Ver
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACT TAB */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Envíanos un Mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Asunto</label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="¿En qué podemos ayudarte?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Prioridad</label>
                    <select 
                      className="w-full border rounded-md p-2 text-sm"
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                    >
                      <option value="low">Baja - Consulta general</option>
                      <option value="medium">Media - Necesito ayuda</option>
                      <option value="high">Alta - Problema urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Mensaje</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Describe tu consulta o problema con el mayor detalle posible..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Options */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Otras Formas de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">soporte@sintra-latam.com</p>
                      <p className="text-xs text-gray-500">Respuesta en &lt; 24h</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-gray-600">+52 55 1234 5678</p>
                      <p className="text-xs text-gray-500">Lun-Vie 9:00-18:00 (GMT-6)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Teléfono (Premium)</p>
                      <p className="text-sm text-gray-600">+52 55 8765 4321</p>
                      <p className="text-xs text-gray-500">Solo planes Professional+</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiempos de Respuesta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Consultas Generales</span>
                    <Badge variant="secondary">&lt; 24h</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Problemas Técnicos</span>
                    <Badge variant="secondary">&lt; 12h</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Emergencias (Premium)</span>
                    <Badge variant="default">&lt; 2h</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* STATUS TAB */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Todos los Sistemas Operativos</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  99.9% Uptime
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API de Asistentes</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operativo</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Dashboard Web</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operativo</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Integraciones WhatsApp</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operativo</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Automatizaciones</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operativo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incidentes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Mantenimiento Programado Completado</p>
                    <p className="text-sm text-gray-600">
                      Actualización de servidores finalizada exitosamente
                    </p>
                    <p className="text-xs text-gray-500">Hace 2 días • Duración: 30 min</p>
                  </div>
                </div>

                <div className="text-center text-gray-500 text-sm py-4">
                  No hay incidentes activos
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Tiempo de Respuesta API</span>
                  <span className="text-sm font-medium">124ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Disponibilidad (30 días)</span>
                  <span className="text-sm font-medium">99.97%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.97%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
