import { Card } from "@/components/card";
import { Progress } from "@/components/progress";
import { Trophy, Target, Zap } from "lucide-react";

interface ProgressCardProps {
  completedPlans: number;
  totalPlans: number;
  completedReviews: number;
  totalReviews: number;
}

export const ProgressCard = ({ completedPlans, totalPlans, completedReviews, totalReviews }: ProgressCardProps) => {
  const planProgress = totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0;
  const reviewProgress = totalReviews > 0 ? (completedReviews / totalReviews) * 100 : 0;

  return (
    <Card className="p-6 shadow-soft">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-success">
          <Trophy className="h-6 w-6 text-success-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Seu Progresso</h3>
          <p className="text-sm text-muted-foreground">Continue assim!</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-medium">Planos de Estudo</span>
            </div>
            <span className="text-muted-foreground">
              {completedPlans}/{totalPlans}
            </span>
          </div>
          <Progress value={planProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium">Revisões</span>
            </div>
            <span className="text-muted-foreground">
              {completedReviews}/{totalReviews}
            </span>
          </div>
          <Progress value={reviewProgress} className="h-2" />
        </div>
      </div>
    </Card>
  );
};
