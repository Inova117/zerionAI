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
      const initialActivities = await dashboardMetrics.getActivities(limit);
      setActivities(initialActivities);
      setIsLoading(false);
    };

    fetchActivities();

    // Subscribe to updates
    const unsubscribe = dashboardMetrics.subscribeToActivities((newActivities) => {
      setActivities(prevActivities => {
        const updatedActivities = [...newActivities, ...prevActivities];
        // Remove duplicates and limit
        const uniqueActivities = Array.from(new Map(updatedActivities.map(a => [a.id, a])).values());
        return uniqueActivities.slice(0, limit);
      });
    });

    return unsubscribe;
  }, [limit]);

  return {
    activities,
    isLoading
  };
}
