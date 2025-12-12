import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useProviderPerformance } from "@/hooks/useProviderPerformance";
import { Skeleton } from "@/components/ui/skeleton";

export const PerformanceChart = () => {
  const { performanceData } = useProviderPerformance();

  if (!performanceData || performanceData.length === 0) {
    return (
      <Card className="p-4 md:p-6 bg-card border-border">
        <div className="mb-4 md:mb-6">
          <h2 className="text-base md:text-xl font-semibold text-foreground mb-1">Performance Overview</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Response times over the last 24 hours</p>
        </div>
        <div className="h-[200px] md:h-[300px] flex items-center justify-center text-muted-foreground text-sm">
          No performance data available yet
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 bg-card border-border">
      <div className="mb-4 md:mb-6">
        <h2 className="text-base md:text-xl font-semibold text-foreground mb-1">Performance Overview</h2>
        <p className="text-xs md:text-sm text-muted-foreground">Response times over the last 24 hours</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '10px' }}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '10px' }}
            tick={{ fontSize: 10 }}
            width={40}
            label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
              fontSize: '12px'
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '12px'
            }}
          />
          <Line
            type="monotone"
            dataKey="Primordial"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            name="Primordial"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Awakening"
            stroke="hsl(var(--success))"
            strokeWidth={2}
            name="Awakening"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
