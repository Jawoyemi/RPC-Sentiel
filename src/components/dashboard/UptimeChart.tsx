import { Card } from "@/components/ui/card";
import { useUptimeStats } from "@/hooks/useUptimeStats";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export const UptimeChart = () => {
  const { uptimeData, loading } = useUptimeStats();

  if (loading) {
    return (
      <Card className="p-4 md:p-6">
        <p className="text-muted-foreground text-sm">Loading uptime data...</p>
      </Card>
    );
  }

  // Combine all provider data into chart format
  const dateMap = new Map<string, { date: string; primordial: number; awakening: number }>();

  if (uptimeData && uptimeData.length > 0) {
    uptimeData.forEach((stat: any) => {
      const dateKey = stat.name || format(new Date(stat.date), "MMM dd");
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { date: dateKey, primordial: 0, awakening: 0 });
      }
      const entry = dateMap.get(dateKey)!;
      const uptime = parseFloat(stat.uptime?.toString() || "0");

      // For mock data, use the uptime for both providers
      entry.primordial = uptime;
      entry.awakening = uptime;
    });
  }

  const chartData = Array.from(dateMap.values());

  return (
    <Card className="p-4 md:p-6 space-y-3 md:space-y-4">
      <h3 className="text-base md:text-lg font-semibold text-foreground">
        7-Day Uptime History
      </h3>
      {chartData.length === 0 ? (
        <p className="text-xs md:text-sm text-muted-foreground">No data available yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "10px" }}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "10px" }}
              tick={{ fontSize: 10 }}
              domain={[90, 100]}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="primordial"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Primordial"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="awakening"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              name="Awakening"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
