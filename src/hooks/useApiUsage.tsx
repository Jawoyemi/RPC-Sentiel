import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface UsageDataPoint {
  date: string;
  requests: number;
  provider: string;
}

export const useApiUsage = () => {
  const [usage, setUsage] = useState<UsageDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsage = async () => {
      setLoading(true);
      try {
        const data = await api.get<UsageDataPoint[]>("/api/metrics/usage");
        setUsage(data);
      } catch (error) {
        console.error("Failed to fetch usage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  return { usage, loading };
};
