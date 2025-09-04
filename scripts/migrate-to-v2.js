#!/usr/bin/env node

// 🔄 SCRIPT DE MIGRACIÓN AUTOMÁTICA A SUPABASE V2
// Actualiza todas las importaciones para usar las versiones V2

const fs = require('fs');
const path = require('path');

// Mapeo de importaciones a actualizar
const importMappings = [
  {
    from: "import { dashboardMetrics } from '@/lib/dashboard-metrics'",
    to: "import { dashboardMetricsV2 as dashboardMetrics } from '@/lib/dashboard-metrics-v2'"
  },
  {
    from: "import { conversationMemory } from '@/lib/conversation-memory'",
    to: "import { conversationMemoryV2 as conversationMemory } from '@/lib/conversation-memory-v2'"
  },
  {
    from: "import { generateAIResponse } from '@/lib/ai-service'",
    to: "import { generateAIResponse } from '@/lib/ai-service-v2'"
  },
  {
    from: "import { simulateAIResponse } from '@/lib/ai-service'",
    to: "import { simulateAIResponse } from '@/lib/ai-service-v2'"
  },
  {
    from: "import { generateSocialMediaContent } from '@/lib/ai-service'",
    to: "import { generateSocialMediaContent } from '@/lib/ai-service-v2'"
  },
  {
    from: "import { cerebroAI } from '@/lib/cerebro-ai'",
    to: "import { cerebroAIV2 as cerebroAI } from '@/lib/cerebro-ai-v2'"
  }
];

// Archivos a procesar
const filesToProcess = [
  'src/hooks/useChat.ts',
  'src/hooks/useDashboardMetrics.ts',
  'src/components/dashboard/dashboard-stats.tsx',
  'src/components/dashboard/recent-activity.tsx',
  'src/components/dashboard/chat-interface.tsx',
  'src/components/dashboard/progress-tracker.tsx',
  'src/components/dashboard/cerebro-insights.tsx',
  'src/app/dashboard/analytics/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/dashboard/brain/page.tsx',
  'src/app/dashboard/brain/cerebro/page.tsx'
];

console.log('🔄 Iniciando migración automática a Supabase V2...\n');

let updatedFiles = 0;
let totalReplacements = 0;

filesToProcess.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let hasChanges = false;
  let fileReplacements = 0;

  // Aplicar cada mapeo de importación
  importMappings.forEach(mapping => {
    if (content.includes(mapping.from)) {
      content = content.replace(new RegExp(mapping.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), mapping.to);
      hasChanges = true;
      fileReplacements++;
      totalReplacements++;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath} - ${fileReplacements} importaciones actualizadas`);
    updatedFiles++;
  } else {
    console.log(`ℹ️  ${filePath} - Sin cambios necesarios`);
  }
});

console.log('\n🎉 Migración completada!');
console.log(`📊 Archivos actualizados: ${updatedFiles}`);
console.log(`🔄 Total de importaciones cambiadas: ${totalReplacements}`);

if (updatedFiles > 0) {
  console.log('\n📋 Próximos pasos:');
  console.log('1. 🗄️  Ejecutar migraciones de Supabase');
  console.log('2. 🧪 Probar la aplicación');
  console.log('3. 🗑️  Eliminar archivos obsoletos cuando confirmes que todo funciona');
  console.log('\n📖 Ver documentación completa en: docs/MIGRATION_TO_SUPABASE.md');
} else {
  console.log('\n✨ No se encontraron archivos que necesiten actualización');
}
