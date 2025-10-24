import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { Navbar } from "@/components/Navbar";
import { ProgressCard } from "@/components/ProgressCard";
import { ProgressChart } from "@/components/ProgressChart";
import { PlanCard } from "@/components/PlanCard";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, BookOpen, Brain } from "lucide-react";
import { toast } from "sonner";

interface StudyPlan {
  id: number;
  title: string;
  content: string;
  difficulty: string;
  completed: boolean;
  createdAt: string;
}

interface Progress {
  totalPlans: number;
  completedPlans: number;
  totalReviews: number;
  completedReviews: number;
}

interface ActivityData {
  weeklyActivity: number[];
  totalStudyTime: number;
  streak: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { fetchApi } = useApi();
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [progress, setProgress] = useState<Progress>({ totalPlans: 0, completedPlans: 0, totalReviews: 0, completedReviews: 0 });
  const [activityData, setActivityData] = useState<ActivityData>({ weeklyActivity: [0, 0, 0, 0, 0, 0, 0], totalStudyTime: 0, streak: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newPlan, setNewPlan] = useState({
    subjects: "",
    difficulty: "intermediário",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [progressData, plansData, activityResponse] = await Promise.all([
        fetchApi("/progress"),
        fetchApi("/study-plan"),
        fetchApi("/activity"),
      ]);
      setProgress(progressData);
      setPlans(plansData || []);
      setActivityData(activityResponse || { weeklyActivity: [0, 0, 0, 0, 0, 0, 0], totalStudyTime: 0, streak: 0 });
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPlan.subjects.trim()) {
      toast.error("Digite pelo menos uma matéria");
      return;
    }

    try {
      setIsCreating(true);
      const subjects = newPlan.subjects.split(",").map(s => s.trim());
      
      const plan = await fetchApi("/study-plan", {
        method: "POST",
        body: JSON.stringify({
          subjects,
          difficulty: newPlan.difficulty,
        }),
      });

      toast.success("Plano de estudos criado!");
      setShowCreateForm(false);
      setNewPlan({ subjects: "", difficulty: "intermediário" });
      await loadData(); // Recarrega a lista de planos
      navigate(`/plan/${plan.id}`);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Olá, {user?.name || "Estudante"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue sua jornada de aprendizado
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <ProgressCard
              completedPlans={progress.completedPlans}
              totalPlans={progress.totalPlans}
              completedReviews={progress.completedReviews}
              totalReviews={progress.totalReviews}
            />
          </div>

          <Card className="flex flex-col items-center justify-center p-8 text-center shadow-soft md:col-span-2">
            {!showCreateForm ? (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
                  <Plus className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Criar Novo Plano</h3>
                <p className="mb-6 text-muted-foreground">
                  Use IA para criar um plano de estudos personalizado
                </p>
                <Button variant="hero" size="lg" onClick={() => setShowCreateForm(true)}>
                  <Brain className="mr-2 h-5 w-5" />
                  Criar com IA
                </Button>
              </>
            ) : (
              <form onSubmit={handleCreatePlan} className="w-full space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="subjects">Matérias (separadas por vírgula)</Label>
                  <Input
                    id="subjects"
                    placeholder="Ex: Matemática, Física, Química"
                    value={newPlan.subjects}
                    onChange={(e) => setNewPlan({ ...newPlan, subjects: e.target.value })}
                  />
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select
                    value={newPlan.difficulty}
                    onValueChange={(value) => setNewPlan({ ...newPlan, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fácil">Fácil</SelectItem>
                      <SelectItem value="intermediário">Intermediário</SelectItem>
                      <SelectItem value="difícil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" variant="hero" className="flex-1" disabled={isCreating}>
                    {isCreating ? "Criando..." : "Criar Plano"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        <div className="mb-8">
          <ProgressChart
            weeklyActivity={activityData.weeklyActivity}
            totalStudyTime={activityData.totalStudyTime}
            streak={activityData.streak}
          />
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Meus Planos de Estudo</h2>
          </div>

          {plans.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                Você ainda não criou nenhum plano de estudos
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={plan.id} {...plan} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;