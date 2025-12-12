import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendChart } from "@/components/analytics/TrendChart";
import { ProviderComparison as ProviderComparisonAnalytics } from "@/components/analytics/ProviderComparison";
import { ProviderComparison as ProviderComparisonLive } from "@/components/dashboard/ProviderComparison";
import { CostAnalysis } from "@/components/analytics/CostAnalysis";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";

const Analytics = () => {
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Monitoring</h1>
        <p className="text-muted-foreground">Deep dive into performance metrics and trends</p>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="comparison">Provider Comparison</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <TrendChart />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <ProviderComparisonLive />
          <ProviderComparisonAnalytics />
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <CostAnalysis />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
