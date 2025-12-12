import { useState, useEffect } from "react";

export const useRealTimeMetrics = () => {
  // Use camelCase keys to match Dashboard.tsx expectations
  const [metrics, setMetrics] = useState({
    requestsPerSecond: 125.5,
    requestsChange: "+12%",
    avgResponseTime: 45,
    responseTimeChange: "-5%",
    errorRate: 0.1,
    errorRateChange: "-2%",
    totalUptime: 99.9,
    uptimeChange: "+0.1%"
  });

  // Dashboard expects 'loading' boolean
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Determine if we should fetch from backend or just static mock
    // For now static mock is fine as placeholder
  }, []);

  return { metrics, loading };
};
