import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Download, Clock, Star, ArrowLeft, Plus, Check } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import VideoRow from "@/components/VideoRow";

const mockVideos = [
  { id: "1", title: "Matemática Básica", thumbnail: "", ageRating: "Infantil", description: "Aprenda os fundamentos da matemática de forma divertida e interativa.", duration: "45min", year: "2024" },
  { id: "2", title: "Ciências Naturais", thumbnail: "", ageRating: "Infantil", description: "Explore o mundo natural e descubra as maravilhas da ciência.", duration: "38min", year: "2024" },
  { id: "3", title: "História do Brasil", thumbnail: "", ageRating: "Jovem", description: "Conheça os principais eventos que moldaram a história do Brasil.", duration: "52min", year: "2023" },
  { id: "4", title: "Física Moderna", thumbnail: "", ageRating: "Adulto", description: "Mergulhe nos conceitos avançados da física contemporânea.", duration: "1h 15min", year: "2024" },
  { id: "5", title: "Inglês Avançado", thumbnail: "", ageRating: "Adulto", description: "Domine o inglês com técnicas avançadas de conversação.", duration: "1h 5min", year: "2023" },
];

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchLater, removeFromWatchLater, watchLater, rateVideo, ratings, downloadVideo } = usePlan();
  const { toast } = useToast();
  
  const video = mockVideos.find(v => v.id === id);
  const [rating, setRating] = useState(ratings.find(r => r.videoId === id)?.rating || 0);
  const isInWatchLater = watchLater.some(v => v.id === id);

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Vídeo não encontrado</h2>
          <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  const relatedVideos = mockVideos.filter(v => v.id !== id && v.ageRating === video.ageRating).slice(0, 4);

  const handleWatchLater = () => {
    if (isInWatchLater) {
      removeFromWatchLater(id!);
      toast({
        title: "Removido",
        description: "Vídeo removido da sua lista",
      });
    } else {
      addToWatchLater({ id: video.id, title: video.title, thumbnail: video.thumbnail, ageRating: video.ageRating });
      toast({
        title: "Adicionado!",
        description: "Vídeo adicionado para assistir depois",
      });
    }
  };

  const handleDownload = async () => {
    const success = await downloadVideo(id!);
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

  const handleRate = (newRating: number) => {
    setRating(newRating);
    rateVideo(id!, newRating);
    toast({
      title: "Avaliação registrada!",
      description: `Você avaliou com ${newRating} estrelas`,
    });
  };

  const handlePlay = () => {
    toast({
      title: "Reproduzindo vídeo",
      description: "O player será implementado em breve",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10" />
        
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
          <span className="text-6xl text-muted-foreground opacity-20">{video.ageRating}</span>
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-end px-4 md:px-8 lg:px-16 pb-16">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-foreground hover:bg-secondary/80"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              {video.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="text-primary font-semibold">{rating > 0 ? `${rating}★` : "Não avaliado"}</span>
              <span>{video.year}</span>
              <span>{video.duration}</span>
              <span className="px-2 py-1 border border-muted-foreground rounded">{video.ageRating}</span>
            </div>

            <p className="text-base md:text-lg text-foreground/90 mb-8">
              {video.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={handlePlay}>
                <Play className="h-5 w-5" fill="currentColor" />
                Assistir
              </Button>
              
              <Button size="lg" variant="secondary" className="gap-2" onClick={handleWatchLater}>
                {isInWatchLater ? (
                  <>
                    <Check className="h-5 w-5" />
                    Na Lista
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Minha Lista
                  </>
                )}
              </Button>

              <Button size="lg" variant="secondary" className="gap-2" onClick={handleDownload}>
                <Download className="h-5 w-5" />
                Baixar
              </Button>
            </div>

            {/* Rating Section */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">Avalie este conteúdo:</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
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
        </div>
      </div>

      {/* Related Content */}
      {relatedVideos.length > 0 && (
        <div className="pb-8">
          <VideoRow title="Conteúdos Relacionados" videos={relatedVideos} />
        </div>
      )}
    </div>
  );
};

export default VideoDetail;
