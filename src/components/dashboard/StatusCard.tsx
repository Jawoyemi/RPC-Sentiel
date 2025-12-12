import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  name: string;
  status: "online" | "slow" | "offline";
  responseTime: number;
  uptime: number;
}

export const StatusCard = ({ name, status, responseTime, uptime }: StatusCardProps) => {
  const statusConfig = {
    online: { color: "bg-success", text: "Online", badgeVariant: "default" as const },
    slow: { color: "bg-warning", text: "Slow", badgeVariant: "secondary" as const },
    offline: { color: "bg-destructive", text: "Offline", badgeVariant: "destructive" as const },
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <Card className="p-4 md:p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={cn("w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-pulse", config.color)} />
          <Server className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
        </div>
        <Badge variant={config.badgeVariant} className="text-xs">{config.text}</Badge>
      </div>

      <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4 truncate">{name}</h3>

      <div className="space-y-1.5 md:space-y-2">
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-muted-foreground">Response Time</span>
          <span className="font-medium text-foreground">
            {responseTime > 0 ? `${responseTime}ms` : "N/A"}
          </span>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-muted-foreground">Uptime</span>
          <span className="font-medium text-foreground">{uptime}%</span>
        </div>
      </div>
    </Card>
  );
};
