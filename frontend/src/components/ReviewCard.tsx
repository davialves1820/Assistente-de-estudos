import { useState } from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface ReviewCardProps {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
  completed: boolean;
  onComplete: (id: number) => void;
}

export const ReviewCard = ({ id, question, answer, difficulty, completed, onComplete }: ReviewCardProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  
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
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{question}</h3>
            </div>
          </div>
          {completed && (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
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

        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Ocultar Resposta
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Ver Resposta
              </>
            )}
          </Button>

          {showAnswer && (
            <div className="rounded-lg bg-muted/50 p-4 animate-fade-in">
              <p className="text-sm">{answer}</p>
            </div>
          )}

          {!completed && (
            <Button
              variant="success"
              size="sm"
              className="w-full"
              onClick={() => onComplete(id)}
            >
              Marcar como Concluído
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
