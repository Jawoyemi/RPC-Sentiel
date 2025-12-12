import { useState, useEffect } from "react";

export const useProviderPerformance = () => {
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data
    const data = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      primordial: 40 + Math.random() * 20,
      awakening: 45 + Math.random() * 25
    }));
    setPerformanceData(data);
  }, []);

  return { performanceData };
};
