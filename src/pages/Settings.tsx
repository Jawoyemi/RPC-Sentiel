import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertSettings } from "@/components/settings/AlertSettings";
import { ProviderSettings } from "@/components/settings/ProviderSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
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
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure alerts, providers, and notifications</p>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="alerts">Alert Rules</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <AlertSettings />
        </TabsContent>

        <TabsContent value="providers">
          <ProviderSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Settings;
