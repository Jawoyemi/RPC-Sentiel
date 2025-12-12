import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, AlertTriangle } from "lucide-react";

export const AlertSettings = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Response Time Alerts</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when response time exceeds threshold</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="response-threshold">Threshold (ms)</Label>
            <Input id="response-threshold" type="number" defaultValue="300" className="bg-background" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">Error Rate Alerts</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when error rate is too high</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="error-threshold">Threshold (%)</Label>
            <Input id="error-threshold" type="number" defaultValue="1" step="0.1" className="bg-background" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">Provider Downtime Alerts</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when a provider goes offline</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Save Changes
        </Button>
      </div>
    </div>
  );
};
