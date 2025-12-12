import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useProviderHealth } from "@/hooks/useProviderHealth";

export const ProviderComparison = () => {
  const { providers } = useProviderHealth();

  const comparisonData = Array.from(providers.values()).map(p => ({
    provider: p.provider_url.includes('primordial') 
      ? 'Primordial Node' 
      : p.provider_url.includes('awakening') 
      ? 'Awakening Relay' 
      : p.provider_url.replace('https://', '').split('.')[0],
    responseTime: p.response_time_ms,
    status: p.status,
  }));

  return (
    <Card className="p-6 bg-card border-border">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">Provider Comparison</h2>
        <p className="text-sm text-muted-foreground">Compare response times across providers</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="provider" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend />
          <Bar 
            dataKey="responseTime" 
            fill="hsl(var(--primary))" 
            name="Response Time (ms)"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};