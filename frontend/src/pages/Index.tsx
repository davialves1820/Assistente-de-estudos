import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { Navbar } from "@/components/Navbar";
import { Brain, Sparkles, Target, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "IA Personalizada",
      description: "Planos de estudo criados por IA adaptados ao seu nível e objetivos",
    },
    {
      icon: Target,
      title: "Foco no que Importa",
      description: "Revisões inteligentes com flashcards gerados automaticamente",
    },
    {
      icon: Zap,
      title: "Aprenda Mais Rápido",
      description: "Acompanhe seu progresso e evolua continuamente",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero pt-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDE0OSwgOTcsIDIyNiwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] opacity-40" />
        
        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Powered by AI
            </div>
            
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Estude de forma{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                inteligente
              </span>
              , não mais difícil
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl">
              Crie planos de estudo personalizados com IA e aprenda com revisões inteligentes
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate(user ? "/dashboard" : "/auth?mode=register")}
                className="group"
              >
                {user ? "Ir para Dashboard" : "Começar Gratuitamente"}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              {!user && (
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => navigate("/auth")}
                >
                  Já tenho conta
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Por que escolher o StudyAI?
            </h2>
            <p className="text-lg text-muted-foreground">
              Tudo que você precisa para alcançar seus objetivos de aprendizado
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-border bg-card p-8 shadow-soft transition-all hover:shadow-glow"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 text-center shadow-glow">
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                Pronto para começar sua jornada?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/90">
                Junte-se a milhares de estudantes que já melhoraram seus estudos
              </p>
              <Button 
                variant="secondary" 
                size="xl"
                onClick={() => navigate(user ? "/dashboard" : "/auth?mode=register")}
              >
                {user ? "Acessar Dashboard" : "Criar Conta Grátis"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
