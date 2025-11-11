import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-background/0 px-4 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
          SENAIFLIX
        </h1>
        <div className="flex items-center gap-4">
          {isAuthenticated && user && (
            <>
              <span className="text-foreground hidden md:inline">
                Olá, {user.name} ({user.type})
              </span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="text-foreground hover:text-primary"
              >
                <LogOut className="h-5 w-5" />
              </Button>
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
