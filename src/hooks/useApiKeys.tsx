import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ApiKey {
  id: number;
  name: string;
  key: string;
  created_at: string;
  last_used: string | null;
  is_active: boolean;
}

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApiKeys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<ApiKey[]>("/api/keys");
      setApiKeys(data);
    } catch (error: any) {
      console.error("Failed to fetch API keys:", error);
      toast.error(error.message || "Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  }, []);

  const createApiKey = async (name: string) => {
    try {
      const newKey = await api.post<ApiKey>("/api/keys", { name });
      setApiKeys([...apiKeys, newKey]);
      toast.success("API key created successfully");
      return newKey;
    } catch (error: any) {
      console.error("Failed to create API key:", error);
      toast.error(error.message || "Failed to create API key");
      throw error;
    }
  };

  const deleteApiKey = async (keyId: number) => {
    try {
      await api.delete(`/api/keys/${keyId}`);
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast.success("API key deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete API key:", error);
      toast.error(error.message || "Failed to delete API key");
      throw error;
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return { apiKeys, createApiKey, deleteApiKey, loading };
};
