import { Button } from "@/components/ui/button";
import { Activity, Clock, TrendingUp, AlertCircle, RefreshCw, LogOut } from "lucide-react";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { BestProvider } from "@/components/dashboard/BestProvider";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { UptimeChart } from "@/components/dashboard/UptimeChart";
import { useProviderHealth } from "@/hooks/useProviderHealth";
import { useAuth } from "@/hooks/useAuth";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

const Dashboard = () => {
  const { providers, loading, triggerHealthCheck } = useProviderHealth();
  const { user, loading: authLoading, signOut } = useAuth();
  const { metrics, loading: metricsLoading } = useRealTimeMetrics();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Trigger initial health check and set up interval
  useEffect(() => {
    if (user) {
      triggerHealthCheck();
      
      // Run health check every 30 seconds
      const interval = setInterval(() => {
        triggerHealthCheck();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  // Convert Map to Array for rendering
  const providerArray = Array.from(providers.values()).map(p => ({
    name: p.provider_url.includes('primordial') 
      ? 'Primordial Node' 
      : p.provider_url.includes('awakening') 
      ? 'Awakening Relay' 
      : p.provider_url.replace('https://', ''),
    status: p.status,
    responseTime: p.response_time_ms,
    uptime: 99.9,
  }));

  const bestProvider = providerArray.find(p => p.status === 'online') || providerArray[0];

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">Monitor your BlockDAG RPC endpoints in real-time</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={triggerHealthCheck}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs md:text-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden xs:inline">Check</span> Health
            </Button>
            <Button onClick={signOut} variant="outline" size="sm" className="gap-1.5 text-xs md:text-sm">
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden xs:inline">Sign</span> Out
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {metricsLoading ? (
            <>
              <Skeleton className="h-24 md:h-32 w-full" />
              <Skeleton className="h-24 md:h-32 w-full" />
              <Skeleton className="h-24 md:h-32 w-full" />
              <Skeleton className="h-24 md:h-32 w-full" />
            </>
          ) : (
            <>
              <MetricCard
                title="Requests/sec"
                value={metrics.requestsPerSecond.toFixed(2)}
                change={metrics.requestsChange}
                icon={Activity}
                trend="up"
              />
              <MetricCard
                title="Avg Response"
                value={`${metrics.avgResponseTime}ms`}
                change={metrics.responseTimeChange}
                icon={Clock}
                trend={metrics.responseTimeChange.startsWith("-") ? "down" : "up"}
              />
              <MetricCard
                title="Error Rate"
                value={`${metrics.errorRate}%`}
                change={metrics.errorRateChange}
                icon={AlertCircle}
                trend={metrics.errorRateChange.startsWith("-") ? "down" : "up"}
              />
              <MetricCard
                title="Total Uptime"
                value={`${metrics.totalUptime}%`}
                change={metrics.uptimeChange}
                icon={TrendingUp}
                trend="up"
              />
            </>
          )}
        </div>

        {/* Best Provider Highlight */}
        {loading ? (
          <Skeleton className="h-32 md:h-40 w-full" />
        ) : bestProvider ? (
          <BestProvider 
            provider={bestProvider.name} 
            responseTime={bestProvider.responseTime} 
            uptime={bestProvider.uptime} 
          />
        ) : null}

        {/* Performance Chart */}
        <PerformanceChart />

        {/* Alerts and Uptime */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <UptimeChart />
          <AlertsList />
        </div>

        {/* Provider Status Grid */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">Provider Status</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <Skeleton className="h-36 md:h-48 w-full" />
              <Skeleton className="h-36 md:h-48 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {providerArray.map((provider) => (
                <StatusCard key={provider.name} {...provider} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
