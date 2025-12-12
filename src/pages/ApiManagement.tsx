import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Key } from "lucide-react";
import { ApiKeyCard } from "@/components/api/ApiKeyCard";
import { UsageChart } from "@/components/api/UsageChart";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useApiUsage } from "@/hooks/useApiUsage";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";

const ApiManagement = () => {
  const { apiKeys, loading: keysLoading, deleteApiKey } = useApiKeys();
  const { totalRequests } = useApiUsage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">API Management</h1>
          <p className="text-muted-foreground">
            Create and manage your RPC Sentinel API keys • {totalRequests.toLocaleString()} total requests
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Create New Key
        </Button>
      </div>

      <UsageChart />

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Active API Keys</h2>
        <div className="space-y-4">
          {keysLoading ? (
            <>
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </>
          ) : apiKeys.length === 0 ? (
            <Card className="p-8 text-center border-border">
              <p className="text-muted-foreground">No API keys yet. Create one to get started.</p>
            </Card>
          ) : (
            apiKeys.map((key) => (
              <ApiKeyCard 
                key={key.id} 
                id={key.id}
                name={key.name}
                apiKey={`${key.key_prefix}••••••••••••`}
                created={new Date(key.created_at).toLocaleDateString()}
                requests={0}
                rateLimit={`${key.rate_limit_per_minute}/min`}
                onDelete={deleteApiKey}
              />
            ))
          )}
        </div>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-start gap-4">
          <Key className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="space-y-3 flex-1">
            <h3 className="text-lg font-semibold text-foreground">Integration Example</h3>
            <p className="text-sm text-muted-foreground">Use your API key to connect to BlockDAG RPC endpoints:</p>
            <div className="bg-background/50 border border-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code className="text-primary whitespace-pre">
{`curl -X POST https://svvcyjiputpvofaviewo.supabase.co/functions/v1/rpc-proxy \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "method": "dag_getBlockByHash",
    "params": ["0x..."],
    "id": 1
  }'`}
              </code>
            </div>
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm font-semibold text-foreground mb-2">Available RPC Endpoints:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• https://node.primordial.bdagscan.com</li>
                <li>• https://relay.awakening.bdagscan.com</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default ApiManagement;
