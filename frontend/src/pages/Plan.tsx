import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Badge } from "@/components/badge";
import { Navbar } from "@/components/Navbar";
import { useApi } from "@/hooks/useApi";
import { ArrowLeft, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface StudyPlan {
  id: number;
  title: string;
  content: string;
  difficulty: string;
  completed: boolean;
  createdAt: string;
}

const Plan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchApi } = useApi();
  
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    try {
      setIsLoading(true);
      const planData = await fetchApi(`/study-plan/${id}`);
      setPlan(planData);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!plan) return;
    
    try {
      setIsCompleting(true);
      await fetchApi(`/study-plan/${id}/complete`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      
      toast.success("Plano marcado como concluído!");
      setPlan({ ...plan, completed: true });
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <BookOpen className="mb-4 h-16 w-16 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">Plano não encontrado</p>
        <Button variant="outline" onClick={() => navigate("/dashboard")} className="mt-4">
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  const difficultyColors = {
    fácil: "bg-success/10 text-success",
    intermediário: "bg-primary/10 text-primary",
    difícil: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <Card className="p-8 shadow-soft">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{plan.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Criado em {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="secondary" className={difficultyColors[plan.difficulty as keyof typeof difficultyColors]}>
                {plan.difficulty}
              </Badge>
              {plan.completed && (
                <Badge variant="secondary" className="bg-success/10 text-success">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Concluído
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {plan.content.split('\n\n').map((section, idx) => {
              const lines = section.trim().split('\n');
              
              return (
                <div key={idx} className="rounded-lg bg-muted/50 p-6 transition-all hover:bg-muted/70">
                  {lines.map((line, lineIdx) => {
                    if (line.startsWith('## ')) {
                      return <h3 key={lineIdx} className="mb-3 text-xl font-semibold text-primary">{line.replace('## ', '')}</h3>;
                    }
                    if (line.startsWith('# ')) {
                      return <h2 key={lineIdx} className="mb-4 text-2xl font-bold">{line.replace('# ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h4 key={lineIdx} className="mb-2 text-lg font-medium">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <div key={lineIdx} className="mb-2 flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <p className="text-foreground leading-relaxed">{line.replace('- ', '')}</p>
                        </div>
                      );
                    }
                    if (line.startsWith('* ')) {
                      return (
                        <div key={lineIdx} className="mb-2 flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <p className="text-foreground leading-relaxed">{line.replace('* ', '')}</p>
                        </div>
                      );
                    }
                    if (line.match(/^\d+\./)) {
                      return (
                        <div key={lineIdx} className="mb-2 flex items-start gap-3">
                          <span className="font-semibold text-primary">{line.match(/^\d+\./)?.[0]}</span>
                          <p className="text-foreground leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                      );
                    }
                    if (line.trim()) {
                      return <p key={lineIdx} className="mb-2 text-foreground leading-relaxed">{line}</p>;
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </div>

          {!plan.completed && (
            <div className="mt-8 flex justify-end">
              <Button 
                variant="success" 
                size="lg"
                onClick={handleComplete}
                disabled={isCompleting}
              >
                {isCompleting ? "Salvando..." : "Marcar como Concluído"}
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Plan;