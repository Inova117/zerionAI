"use client";

import { useState, useEffect } from 'react';
import { dashboardMetrics, DashboardMetrics, ActivityEvent } from '@/lib/dashboard-metrics';

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
    onAutomationSetup: dashboardMetrics.onAutomationSetup.bind(dashboardMetrics),
    resetMetrics: dashboardMetrics.resetMetrics.bind(dashboardMetrics)
  };
}

export function useDashboardActivities(limit: number = 10) {
  const [activities, setActivities] = useState<ActivityEvent[]>(dashboardMetrics.getRecentActivities(limit));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setActivities(dashboardMetrics.getRecentActivities(limit));
    setIsLoading(false);

    // Subscribe to updates
    const unsubscribe = dashboardMetrics.subscribeToActivities((newActivities) => {
      setActivities(newActivities.slice(0, limit));
    });

    return unsubscribe;
  }, [limit]);

  return {
    activities,
    isLoading
  };
}
