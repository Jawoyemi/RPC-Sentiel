import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApiUsage } from "@/hooks/useApiUsage";
import { Skeleton } from "@/components/ui/skeleton";

export const UsageChart = () => {
  const { usageData, loading } = useApiUsage();

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-[250px]" />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">API Usage</h2>
        <p className="text-sm text-muted-foreground">
          Request volume over the last 7 days • Real-time updates
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={usageData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Bar 
            dataKey="requests" 
            fill="hsl(var(--primary))" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
