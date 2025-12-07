import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Crown, Clock, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, profile, logout, isAuthenticated } = useAuth();
  const { userPlan, watchLater, plans } = usePlan();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-background/0 px-4 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
          SENAIFLIX
        </h1>
        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/watch-later")}
                className="hidden md:flex items-center gap-2 text-foreground hover:text-primary"
              >
                <Clock className="h-4 w-4" />
                <span>Assistir Depois ({watchLater.length})</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-primary">
                    <Crown className="h-5 w-5" />
                    <span className="hidden md:inline">
                      {plans.find(p => p.id === userPlan.plan)?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                  <DropdownMenuLabel className="text-popover-foreground">
                    <div>
                      <p className="font-semibold">{profile?.full_name || user.email}</p>
                      <p className="text-sm text-muted-foreground">{profile?.age_group || 'adulto'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={() => navigate("/plans")}
                    className="text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Meu Plano</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/watch-later")}
                    className="text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Assistir Depois ({watchLater.length})</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/my-ratings")}
                    className="text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    <span>Minhas Avaliações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {!isAuthenticated && (
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/auth")}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
