import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

export const MetricCard = ({ title, value, change, icon: Icon, trend }: MetricCardProps) => {
  const trendColor = trend === "up" ? "text-success" : "text-destructive";
  
  return (
    <Card className="p-4 md:p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        <div className={cn("flex items-center gap-1 text-xs md:text-sm font-medium", trendColor)}>
          {trend === "up" ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />}
          <span>{change}</span>
        </div>
      </div>
      
      <div className="space-y-0.5 md:space-y-1">
        <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  );
};
