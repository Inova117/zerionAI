"use client";

import { AssistantGrid } from "@/components/dashboard/assistant-grid";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProgressTracker } from "@/components/dashboard/progress-tracker";
import { CerebroInsights } from "@/components/dashboard/cerebro-insights";

export default function DashboardPage() {
  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            ¡Bienvenido a tu equipo de IA! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Tus asistentes están listos para ayudarte. Selecciona uno para empezar a conversar.
          </p>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <section>
              <DashboardStats />
            </section>

            {/* Progress & Actions Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <section>
                <ProgressTracker />
              </section>
              <section>
                <QuickActions />
              </section>
            </div>

            {/* Assistants Grid */}
            <section>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tus Asistentes Principales
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Haz clic en cualquier asistente para comenzar una conversación
                </p>
              </div>
              <AssistantGrid />
            </section>

            {/* Recent Activity */}
            <section>
              <RecentActivity />
            </section>
          </div>

          {/* Sidebar - Right Side */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6">
              <CerebroInsights />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
