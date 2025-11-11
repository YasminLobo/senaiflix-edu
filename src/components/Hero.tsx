import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-[70vh] flex items-center px-4 md:px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
      
      <div className="relative z-20 max-w-xl space-y-4">
        <h2 className="text-4xl md:text-6xl font-bold">
          Aprenda com os Melhores Conteúdos
        </h2>
        <p className="text-lg text-muted-foreground">
          Acesse milhares de vídeos educacionais organizados por faixa etária. 
          Continue de onde parou e aprenda no seu ritmo.
        </p>
        <div className="flex gap-3">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Play className="mr-2 h-5 w-5" />
            Assistir Agora
          </Button>
          <Button size="lg" variant="secondary" className="bg-secondary/50 hover:bg-secondary">
            <Info className="mr-2 h-5 w-5" />
            Mais Informações
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
