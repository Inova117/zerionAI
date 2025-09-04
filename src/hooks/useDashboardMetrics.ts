"use client";

import { useState, useEffect } from 'react';
import { dashboardMetricsV2 as dashboardMetrics, type DashboardMetrics } from '@/lib/dashboard-metrics-v2';
import { type ActivityEvent } from '@/lib/supabase-services';

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(dashboardMetrics.getMetrics());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setMetrics(dashboardMetrics.getMetrics());
    setIsLoading(false);

    // Subscribe to updates
    const unsubscribe = dashboardMetrics.subscribe((newMetrics) => {
      setMetrics(newMetrics);
    });

    return unsubscribe;
  }, []);

  return {
    metrics,
    isLoading,
    onTaskCompleted: dashboardMetrics.onTaskCompleted.bind(dashboardMetrics),
    onFileGenerated: dashboardMetrics.onFileGenerated.bind(dashboardMetrics),
    onAutomationSetup: dashboardMetrics.onAutomationSetup.bind(dashboardMetrics)
  };
}

export function useDashboardActivities(limit: number = 10) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      const initialActivities = await dashboardMetrics.getActivities();
      setActivities(initialActivities.slice(0, limit));
      setIsLoading(false);
    };

    fetchActivities();

    // TODO: Implement subscribeToActivities in DashboardMetricsV2
    // For now, just polling every 30 seconds
    const interval = setInterval(() => {
      fetchActivities();
    }, 30000);

    return () => clearInterval(interval);
  }, [limit]);

  return {
    activities,
    isLoading
  };
}
