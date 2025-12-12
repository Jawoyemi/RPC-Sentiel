import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface HealthCheck {
  status: string;
  response_time_ms: number | null;
  checked_at: string;
}

interface Provider {
  id: number;
  name: string;
  url: string;
  description: string | null;
  created_at: string;
  latest_health: HealthCheck | null;
  uptime: number;
}

export const useProviderHealth = () => {
  const [providers, setProviders] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(false);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Provider[]>("/api/providers");

      const providerMap = new Map();
      data.forEach((p) => {
        providerMap.set(p.name, {
          id: p.id,
          provider_url: p.url,
          status: p.latest_health?.status || "unknown",
          response_time_ms: p.latest_health?.response_time_ms || 0,
          uptime: p.uptime,
          last_checked: p.latest_health?.checked_at || p.created_at
        });
      });

      setProviders(providerMap);
    } catch (error: any) {
      console.error("Failed to fetch providers:", error);
      toast.error(error.message || "Could not connect to backend");
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerHealthCheck = useCallback(async (providerId?: number) => {
    setLoading(true);
    try {
      if (providerId) {
        await api.post(`/api/providers/${providerId}/check`);
      }
      await fetchProviders();
      toast.success("Health check updated");
    } catch (error: any) {
      console.error("Health check failed:", error);
      toast.error(error.message || "Health check failed");
    } finally {
      setLoading(false);
    }
  }, [fetchProviders]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    providers,
    loading,
    triggerHealthCheck,
    refreshProviders: fetchProviders,
  };
};