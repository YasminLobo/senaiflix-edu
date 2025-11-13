import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoRow from "@/components/VideoRow";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";

const mockVideos = [
  { id: "1", title: "Matemática Básica", thumbnail: "", ageRating: "Infantil" },
  { id: "2", title: "Ciências Naturais", thumbnail: "", ageRating: "Infantil" },
  { id: "3", title: "História do Brasil", thumbnail: "", ageRating: "Jovem" },
  { id: "4", title: "Física Moderna", thumbnail: "", ageRating: "Adulto" },
  { id: "5", title: "Inglês Avançado", thumbnail: "", ageRating: "Adulto" },
];

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { ratings } = usePlan();
  const navigate = useNavigate();

  const topRatedVideos = mockVideos
    .map(video => ({
      ...video,
      rating: ratings.find(r => r.videoId === video.id)?.rating || 0
    }))
    .filter(v => v.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      {topRatedVideos.length > 0 && (
        <VideoRow title="Melhor Avaliados por Você" videos={topRatedVideos} />
      )}
      <VideoRow title="Continue Assistindo" videos={mockVideos.slice(0, 3)} />
      <VideoRow title="Conteúdo Infantil" videos={mockVideos.filter(v => v.ageRating === "Infantil")} />
      <VideoRow title="Conteúdo Jovem" videos={mockVideos.filter(v => v.ageRating === "Jovem")} />
      <VideoRow title="Conteúdo Adulto" videos={mockVideos.filter(v => v.ageRating === "Adulto")} />
    </div>
  );
};

export default Index;
