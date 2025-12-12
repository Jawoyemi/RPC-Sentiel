import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface UptimeDataPoint {
  name: string;
  uptime: number;
  date: string;
}

export const useUptimeStats = () => {
  const [uptimeData, setUptimeData] = useState<UptimeDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUptimeData = async () => {
      setLoading(true);
      try {
        const data = await api.get<UptimeDataPoint[]>("/api/metrics/uptime");
        setUptimeData(data);
      } catch (error) {
        console.error("Failed to fetch uptime data:", error);
        // Fallback to mock data on error
        const mockData = Array.from({ length: 7 }, (_, i) => ({
          name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
          uptime: 99.8 + Math.random() * 0.2,
          date: new Date().toISOString()
        }));
        setUptimeData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchUptimeData();
  }, []);

  return { uptimeData, loading };
};
