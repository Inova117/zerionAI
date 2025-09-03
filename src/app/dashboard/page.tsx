"use client";

import { AssistantGrid } from "@/components/dashboard/assistant-grid";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProgressTracker } from "@/components/dashboard/progress-tracker";
import { CerebroInsights } from "@/components/dashboard/cerebro-insights";

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          ¡Bienvenido a tu equipo de IA! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Tus asistentes están listos para ayudarte. Selecciona uno para empezar a conversar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <DashboardStats />

          {/* Progress Tracking */}
          <ProgressTracker />

          {/* Quick Actions */}
          <QuickActions />

          {/* Assistants Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Tus 3 Asistentes Principales
            </h2>
            <AssistantGrid />
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>

        {/* Cerebro AI Sidebar */}
        <div className="lg:col-span-1">
          <CerebroInsights />
        </div>
      </div>
    </div>
  );
}
