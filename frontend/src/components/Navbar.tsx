import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, LogOut, LayoutDashboard, Lightbulb } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Brain className="h-6 w-6 text-primary" />
          <span className="bg-gradient-primary bg-clip-text text-transparent">StudyAI</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/reviews")}>
                <Lightbulb className="mr-2 h-4 w-4" />
                Revisões
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Entrar
              </Button>
              <Button variant="hero" size="sm" onClick={() => navigate("/auth?mode=register")}>
                Começar Grátis
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
