import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Alert {
  id: number;
  provider_name: string;
  provider_url?: string;
  severity: string;
  alert_type?: string;
  message: string;
  created_at: string;
  resolved: boolean;
}

export const useProviderAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const data = await api.get<Alert[]>("/api/alerts");
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { alerts, loading };
};
