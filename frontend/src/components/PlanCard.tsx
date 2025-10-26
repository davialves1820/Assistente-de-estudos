import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { BookOpen, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog";

interface PlanCardProps {
  id: number;
  title: string;
  difficulty: string;
  completed: boolean;
  createdAt: string;
  onDelete?: (id: number) => void;
}

export const PlanCard = ({ id, title, difficulty, completed, createdAt, onDelete }: PlanCardProps) => {
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

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/plan/${id}`)}
          >
            Ver Detalhes
          </Button>
          
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deletar plano de estudos?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O plano "{title}" será permanentemente removido.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(id)}>
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </Card>
  );
};
