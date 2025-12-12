import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Server } from "lucide-react";

const providers = [
  { id: "1", name: "Provider A", endpoint: "https://rpc-a.blockdag.io", priority: 1 },
  { id: "2", name: "Provider B", endpoint: "https://rpc-b.blockdag.io", priority: 2 },
  { id: "3", name: "Provider C", endpoint: "https://rpc-c.blockdag.io", priority: 3 },
];

export const ProviderSettings = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">RPC Providers</h3>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
        </div>

        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="p-4 bg-secondary/50 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{provider.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{provider.endpoint}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`priority-${provider.id}`}>Priority</Label>
                  <Input 
                    id={`priority-${provider.id}`}
                    type="number" 
                    defaultValue={provider.priority}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`interval-${provider.id}`}>Health Check Interval (s)</Label>
                  <Input 
                    id={`interval-${provider.id}`}
                    type="number" 
                    defaultValue="30"
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          ))}
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
