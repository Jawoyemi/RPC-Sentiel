import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyCardProps {
  id: string;
  name: string;
  apiKey: string;
  created: string;
  requests: number;
  rateLimit: string;
  onDelete?: (id: string) => void;
}

export const ApiKeyCard = ({ id, name, apiKey, created, requests, rateLimit, onDelete }: ApiKeyCardProps) => {
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <Badge variant="secondary">Active</Badge>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-sm">
            <code className="text-muted-foreground">
              {showKey ? apiKey : apiKey.replace(/./g, "•")}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKey(!showKey)}
              className="h-7 px-2"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Created</p>
          <p className="text-sm font-medium text-foreground">{created}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Requests</p>
          <p className="text-sm font-medium text-foreground">{requests.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Rate Limit</p>
          <p className="text-sm font-medium text-foreground">{rateLimit}</p>
        </div>
      </div>
    </Card>
  );
};
