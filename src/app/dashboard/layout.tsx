"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { LiveNotifications } from "@/components/dashboard/live-notifications";
import { Toaster } from "@/components/ui/sonner";
import { useState, useEffect } from "react";
import { backgroundAutomation } from "@/lib/background-automation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize background automations
  useEffect(() => {
    // The background automation manager starts automatically when imported
    // This ensures automations are running as soon as the dashboard loads
    console.log('🤖 Background automations initialized');
    
    // Cleanup on unmount
    return () => {
      backgroundAutomation.destroy();
    };
  }, []);

  return (
    <div className="dashboard-layout bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="dashboard-main flex-1 flex flex-col min-w-0">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster />
      <LiveNotifications />
    </div>
  );
}
