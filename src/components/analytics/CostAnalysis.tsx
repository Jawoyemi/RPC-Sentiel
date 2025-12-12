import { Card } from "@/components/ui/card";
import { DollarSign, TrendingDown } from "lucide-react";

const providers = [
  { name: "Provider A", cost: "$0.0001/request", monthly: "$450", requests: 4500000 },
  { name: "Provider B", cost: "$0.00012/request", monthly: "$456", requests: 3800000 },
  { name: "Provider C", cost: "$0.00015/request", monthly: "$435", requests: 2900000 },
];

export const CostAnalysis = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/30">
        <div className="flex items-center gap-3 mb-4">
          <TrendingDown className="w-6 h-6 text-success" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cost Savings</h3>
            <p className="text-sm text-muted-foreground">Potential monthly savings with smart routing</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-success">$127</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Provider Cost Breakdown</h3>
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.name} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{provider.name}</p>
                <p className="text-sm text-muted-foreground">{provider.cost}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold text-foreground">{provider.monthly}</p>
                <p className="text-xs text-muted-foreground">{provider.requests.toLocaleString()} requests</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
