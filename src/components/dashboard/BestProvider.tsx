import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp } from "lucide-react";

interface BestProviderProps {
  provider: string;
  responseTime: number;
  uptime: number;
}

export const BestProvider = ({ provider, responseTime, uptime }: BestProviderProps) => {
  const displayName = provider.includes('primordial') 
    ? 'Primordial Node' 
    : provider.includes('awakening') 
    ? 'Awakening Relay' 
    : provider;

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.15)]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <h3 className="text-base md:text-lg font-semibold text-foreground">Best Performing Provider</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-primary text-primary-foreground text-xs">Active</Badge>
              <span className="text-lg md:text-xl font-bold text-foreground">{displayName}</span>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-success" />
                <span className="text-muted-foreground">Response:</span>
                <span className="font-semibold text-foreground">{responseTime}ms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Uptime:</span>
                <span className="font-semibold text-foreground">{uptime}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground mb-1">Auto-switching enabled</p>
          <p className="text-xl md:text-2xl font-bold text-primary">{responseTime}ms</p>
          <p className="text-xs text-muted-foreground">avg response</p>
        </div>
      </div>
    </Card>
  );
};
