export interface Assistant {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  specialties: string[];
  examples: string[];
}

// All assistants (for future expansion)
const allAssistants: Assistant[] = [
  {
    id: "sofia",
    name: "Sofía",
    role: "Social Media Manager",
    description: "Tu especialista en redes sociales que crea contenido viral, programa posts automáticamente y gestiona tu comunidad 24/7.",
    avatar: "👩‍💼",
    color: "bg-pink-500",
    specialties: ["Creación de contenido", "Programación de posts", "Gestión de comunidad", "Análisis de tendencias"],
    examples: [
      "Crear calendario de contenido para Instagram",
      "Generar captions virales con hashtags",
      "Responder comentarios automáticamente"
    ]
  },
  {
    id: "carlos",
    name: "Carlos",
    role: "Customer Support Specialist",
    description: "Atiende a tus clientes por WhatsApp, email y redes sociales. Resuelve dudas instantáneamente y escala casos complejos.",
    avatar: "🙋‍♂️",
    color: "bg-blue-500",
    specialties: ["Soporte WhatsApp", "Gestión de tickets", "FAQ automático", "Escalación inteligente"],
    examples: [
      "Responder consultas de productos 24/7",
      "Gestionar devoluciones y cambios",
      "Crear base de conocimiento automática"
    ]
  },
  {
    id: "diana",
    name: "Diana",
    role: "Data Analyst",
    description: "Analiza tus métricas de negocio, identifica oportunidades y genera reportes automáticos con insights accionables.",
    avatar: "📊",
    color: "bg-purple-500",
    specialties: ["Análisis de ventas", "Métricas de marketing", "Forecasting", "Reportes automáticos"],
    examples: [
      "Reportes semanales de performance",
      "Análisis de comportamiento de clientes",
      "Predicciones de ventas por temporada"
    ]
  },
  {
    id: "bruno",
    name: "Bruno",
    role: "Business Development Manager",
    description: "Desarrolla estrategias de crecimiento, identifica nuevas oportunidades y crea planes de expansión para tu negocio.",
    avatar: "🚀",
    color: "bg-green-500",
    specialties: ["Estrategia de crecimiento", "Análisis de mercado", "Plan de negocios", "Identificación de oportunidades"],
    examples: [
      "Crear estrategia de expansión a nuevos mercados",
      "Análisis de competencia y posicionamiento",
      "Desarrollo de nuevas líneas de producto"
    ]
  },
  {
    id: "elena",
    name: "Elena",
    role: "Email Marketing Specialist",
    description: "Diseña campañas de email que convierten, automatiza secuencias de nurturing y optimiza tasas de apertura.",
    avatar: "📧",
    color: "bg-yellow-500",
    specialties: ["Email automation", "Segmentación", "A/B testing", "Secuencias de conversión"],
    examples: [
      "Crear secuencia de bienvenida automática",
      "Campañas de recuperación de carrito",
      "Newsletters con contenido personalizado"
    ]
  },
  {
    id: "gabriel",
    name: "Gabriel",
    role: "Personal Growth Coach",
    description: "Tu coach personal que te ayuda con productividad, organización de tareas y desarrollo de habilidades empresariales.",
    avatar: "🧘‍♂️",
    color: "bg-indigo-500",
    specialties: ["Productividad", "Gestión del tiempo", "Hábitos", "Desarrollo personal"],
    examples: [
      "Crear rutinas matutinas productivas",
      "Planificar objetivos empresariales",
      "Gestionar el balance vida-trabajo"
    ]
  },
  {
    id: "paula",
    name: "Paula",
    role: "Copywriter",
    description: "Escribe copy persuasivo que convierte. Desde emails de ventas hasta landing pages que generan leads.",
    avatar: "✍️",
    color: "bg-red-500",
    specialties: ["Copy de ventas", "Landing pages", "Emails persuasivos", "Scripts de video"],
    examples: [
      "Escribir sales letter para lanzamiento",
      "Crear copy para anuncios de Facebook",
      "Desarrollar secuencia de emails de ventas"
    ]
  },
  {
    id: "samuel",
    name: "Samuel",
    role: "Recruiter",
    description: "Encuentra el talento perfecto para tu equipo. Crea job posts atractivos y automatiza el proceso de selección.",
    avatar: "🔍",
    color: "bg-cyan-500",
    specialties: ["Job posting", "Screening de candidatos", "Entrevistas", "Onboarding"],
    examples: [
      "Crear descripciones de trabajo atractivas",
      "Filtrar CVs automáticamente",
      "Programar y gestionar entrevistas"
    ]
  },
  {
    id: "sergio",
    name: "Sergio",
    role: "SEO Specialist",
    description: "Posiciona tu sitio web en Google. Investiga keywords, optimiza contenido y monitorea rankings automáticamente.",
    avatar: "🔍",
    color: "bg-orange-500",
    specialties: ["Keyword research", "SEO técnico", "Content optimization", "Link building"],
    examples: [
      "Investigación de palabras clave rentables",
      "Auditoría SEO completa del sitio",
      "Estrategia de contenido para posicionamiento"
    ]
  },
  {
    id: "marina",
    name: "Marina",
    role: "Virtual Assistant",
    description: "Tu asistente personal que maneja calendarios, programa reuniones, gestiona emails y organiza tu día a día.",
    avatar: "🗓️",
    color: "bg-teal-500",
    specialties: ["Gestión de calendario", "Organización", "Administración", "Coordinación"],
    examples: [
      "Programar reuniones automáticamente",
      "Gestionar agenda y recordatorios",
      "Organizar archivos y documentos"
    ]
  },
  {
    id: "miguel",
    name: "Miguel",
    role: "Sales Manager",
    description: "Impulsa tus ventas con estrategias probadas. Crea scripts de llamadas, gestiona el pipeline y cierra más deals.",
    avatar: "💼",
    color: "bg-slate-500",
    specialties: ["Pipeline de ventas", "Scripts de llamadas", "Follow-up", "Negociación"],
    examples: [
      "Crear proceso de ventas automatizado",
      "Desarrollar scripts para cold calling",
      "Gestionar seguimiento de prospectos"
    ]
  },
  {
    id: "carmen",
    name: "Carmen",
    role: "eCommerce Manager",
    description: "Optimiza tu tienda online. Gestiona inventario, crea promociones y automatiza el customer journey completo.",
    avatar: "🛒",
    color: "bg-emerald-500",
    specialties: ["Gestión de inventario", "Promociones", "Customer journey", "Conversión"],
    examples: [
      "Automatizar gestión de stock",
      "Crear campañas promocionales",
      "Optimizar proceso de checkout"
    ]
  }
];

// Featured assistants for MVP (only 3 for now)
export const assistants: Assistant[] = [
  allAssistants[0], // Sofía - Social Media Manager
  allAssistants[1], // Carlos - Customer Support Specialist
  allAssistants[6], // Paula - Copywriter
];

export const getAssistantById = (id: string): Assistant | undefined => {
  return allAssistants.find(assistant => assistant.id === id);
};

export const getAssistantsByCategory = (category: string): Assistant[] => {
  const categories: Record<string, string[]> = {
    marketing: ["sofia", "elena", "paula", "sergio"],
    business: ["bruno", "diana", "miguel", "carmen"],
    support: ["carlos", "marina", "samuel", "gabriel"]
  };
  
  return assistants.filter(assistant => 
    categories[category]?.includes(assistant.id)
  );
};
