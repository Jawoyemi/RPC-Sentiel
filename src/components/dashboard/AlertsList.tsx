import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useProviderAlerts } from "@/hooks/useProviderAlerts";
import { formatDistanceToNow } from "date-fns";

export const AlertsList = () => {
  const { alerts, loading } = useProviderAlerts();

  if (loading) {
    return (
      <Card className="p-4 md:p-6">
        <p className="text-muted-foreground text-sm">Loading alerts...</p>
      </Card>
    );
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "offline":
        return <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-destructive flex-shrink-0" />;
      case "slow":
        return <Clock className="w-4 h-4 md:w-5 md:h-5 text-warning flex-shrink-0" />;
      case "recovered":
        return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-success flex-shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "offline":
        return "destructive" as const;
      case "slow":
        return "secondary" as const;
      case "recovered":
        return "default" as const;
      default:
        return "outline" as const;
    }
  };

  const getProviderName = (url: string) => {
    if (!url) return 'Unknown Provider';
    if (url.includes('primordial')) return 'Primordial Node';
    if (url.includes('awakening')) return 'Awakening Relay';
    return url.replace('https://', '');
  };

  return (
    <Card className="p-4 md:p-6 space-y-3 md:space-y-4">
      <h3 className="text-base md:text-lg font-semibold text-foreground">Recent Alerts</h3>
      <div className="space-y-2 md:space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-xs md:text-sm text-muted-foreground">No alerts yet</p>
        ) : (
          alerts.slice(0, 10).map((alert) => {
            const alertType = alert.alert_type || alert.severity || 'info';
            return (
              <div
                key={alert.id}
                className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg bg-muted/50"
              >
                {getAlertIcon(alertType)}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={getAlertVariant(alertType)} className="text-xs">
                      {alertType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-foreground line-clamp-2">{alert.message}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {getProviderName(alert.provider_url || '')}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
