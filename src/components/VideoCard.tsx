import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Clock, Star } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  ageRating: string;
}

const VideoCard = ({ id, title, thumbnail, ageRating }: VideoCardProps) => {
  const navigate = useNavigate();
  const { addToWatchLater, removeFromWatchLater, watchLater, rateVideo, ratings, downloadVideo } = usePlan();
  const { toast } = useToast();
  const [rating, setRating] = useState(ratings.find(r => r.videoId === id)?.rating || 0);
  const isInWatchLater = watchLater.some(v => v.id === id);

  const handleCardClick = () => {
    navigate(`/video/${id}`);
  };

  const handleWatchLater = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchLater) {
      removeFromWatchLater(id);
      toast({
        title: "Removido",
        description: "Vídeo removido da sua lista",
      });
    } else {
      addToWatchLater({ id, title, thumbnail, ageRating });
      toast({
        title: "Adicionado!",
        description: "Vídeo adicionado para assistir depois",
      });
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await downloadVideo(id);
    if (success) {
      toast({
        title: "Download iniciado!",
        description: "O vídeo está sendo baixado",
      });
    } else {
      toast({
        title: "Limite atingido",
        description: "Faça upgrade do seu plano para baixar mais vídeos",
        variant: "destructive",
      });
    }
  };

  const handleRate = (e: React.MouseEvent, newRating: number) => {
    e.stopPropagation();
    setRating(newRating);
    rateVideo(id, newRating);
    toast({
      title: "Avaliação registrada!",
      description: `Você avaliou com ${newRating} estrelas`,
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-md transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-primary cursor-pointer bg-card border-border" onClick={handleCardClick}>
      <div className="aspect-video bg-secondary flex items-center justify-center">
        <span className="text-muted-foreground text-sm">{ageRating}</span>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-secondary/80 hover:bg-secondary"
            onClick={handleWatchLater}
          >
            <Clock className={`h-4 w-4 ${isInWatchLater ? 'text-primary' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-secondary/80 hover:bg-secondary"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-xs text-muted-foreground mb-2">{ageRating}</p>
          
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={(e) => handleRate(e, star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-4 w-4 ${
                    star <= rating
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground'
                  } transition-colors hover:text-accent`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
