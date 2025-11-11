import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-background/0 px-4 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">SENAIFLIX</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Infantil
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Jovem
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Adulto
          </Button>
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            Entrar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
