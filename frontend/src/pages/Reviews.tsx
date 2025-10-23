import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { Navbar } from "@/components/Navbar";
import { ReviewCard } from "@/components/ReviewCard";
import { useApi } from "@/hooks/useApi";
import { Plus, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
  completed: boolean;
  createdAt: string;
}

const Reviews = () => {
  const { fetchApi } = useApi();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newReview, setNewReview] = useState({
    subject: "",
    difficulty: "intermediário",
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      // Mock data for now
      setReviews([]);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.subject.trim()) {
      toast.error("Digite a matéria para revisão");
      return;
    }

    try {
      setIsCreating(true);
      
      const review = await fetchApi("/review", {
        method: "POST",
        body: JSON.stringify({
          subject: newReview.subject,
          difficulty: newReview.difficulty,
        }),
      });

      toast.success("Revisão criada com flashcard!");
      setReviews([review, ...reviews]);
      setShowCreateForm(false);
      setNewReview({ subject: "", difficulty: "intermediário" });
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompleteReview = async (id: number) => {
    try {
      await fetchApi(`/review/${id}/complete`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      
      toast.success("Revisão concluída!");
      setReviews(reviews.map(r => r.id === id ? { ...r, completed: true } : r));
    } catch (error) {
      // Error handled by hook
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
          <h1 className="mb-2 text-3xl font-bold">Revisões Inteligentes 🎯</h1>
          <p className="text-muted-foreground">
            Crie revisões com IA e aprenda com flashcards personalizados
          </p>
        </div>

        <Card className="mb-8 p-8 shadow-soft">
          {!showCreateForm ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
                <Plus className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Nova Revisão</h3>
              <p className="mb-6 text-muted-foreground">
                Gere perguntas e flashcards automaticamente com IA
              </p>
              <Button variant="hero" size="lg" onClick={() => setShowCreateForm(true)}>
                <Lightbulb className="mr-2 h-5 w-5" />
                Criar com IA
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCreateReview} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Matéria</Label>
                <Input
                  id="subject"
                  placeholder="Ex: Equações do segundo grau"
                  value={newReview.subject}
                  onChange={(e) => setNewReview({ ...newReview, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Select
                  value={newReview.difficulty}
                  onValueChange={(value) => setNewReview({ ...newReview, difficulty: value })}
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
                  {isCreating ? "Criando..." : "Criar Revisão"}
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

        <div>
          <h2 className="mb-6 text-2xl font-bold">Minhas Revisões</h2>

          {reviews.length === 0 ? (
            <Card className="p-12 text-center">
              <Lightbulb className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                Você ainda não criou nenhuma revisão
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  {...review}
                  onComplete={handleCompleteReview}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reviews;
