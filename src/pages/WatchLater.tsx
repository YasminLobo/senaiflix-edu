import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { usePlan } from "@/contexts/PlanContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const WatchLater = () => {
  const { watchLater } = usePlan();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 md:px-8 pb-16">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Assistir Depois
          </h1>
        </div>

        {watchLater.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              Sua lista está vazia
            </p>
            <p className="text-muted-foreground mb-6">
              Adicione vídeos para assistir mais tarde
            </p>
            <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
              Explorar Conteúdo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watchLater.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                ageRating={video.ageRating}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchLater;
