import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlanCardProps {
  id: number;
  title: string;
  difficulty: string;
  completed: boolean;
  createdAt: string;
}

export const PlanCard = ({ id, title, difficulty, completed, createdAt }: PlanCardProps) => {
  const navigate = useNavigate();
  
  const difficultyColors = {
    fácil: "bg-success/10 text-success",
    intermediário: "bg-primary/10 text-primary",
    difícil: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-soft">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
          {completed && (
            <CheckCircle2 className="h-5 w-5 text-success" />
          )}
        </div>

        <div className="mb-4 flex gap-2">
          <Badge variant="secondary" className={difficultyColors[difficulty as keyof typeof difficultyColors]}>
            {difficulty}
          </Badge>
          {completed && (
            <Badge variant="secondary" className="bg-success/10 text-success">
              Concluído
            </Badge>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate(`/plan/${id}`)}
        >
          Ver Detalhes
        </Button>
      </div>
    </Card>
  );
};
