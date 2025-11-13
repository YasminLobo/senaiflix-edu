import Header from "@/components/Header";
import { usePlan } from "@/contexts/PlanContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

const mockVideos = [
  { id: "1", title: "Matemática Básica", thumbnail: "", ageRating: "Infantil" },
  { id: "2", title: "Ciências Naturais", thumbnail: "", ageRating: "Infantil" },
  { id: "3", title: "História do Brasil", thumbnail: "", ageRating: "Jovem" },
  { id: "4", title: "Física Moderna", thumbnail: "", ageRating: "Adulto" },
  { id: "5", title: "Inglês Avançado", thumbnail: "", ageRating: "Adulto" },
];

const MyRatings = () => {
  const { ratings } = usePlan();
  const navigate = useNavigate();

  const ratedVideos = ratings.map(rating => {
    const video = mockVideos.find(v => v.id === rating.videoId);
    return video ? { ...video, rating: rating.rating } : null;
  }).filter(Boolean);

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
            Minhas Avaliações
          </h1>
        </div>

        {ratedVideos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              Você ainda não avaliou nenhum vídeo
            </p>
            <p className="text-muted-foreground mb-6">
              Comece a avaliar os conteúdos que você assistiu
            </p>
            <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
              Explorar Conteúdo
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratedVideos.map((video) => (
              <Card key={video!.id} className="p-4 bg-card border-border">
                <h3 className="font-semibold text-foreground mb-2">{video!.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{video!.ageRating}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= video!.rating
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRatings;
