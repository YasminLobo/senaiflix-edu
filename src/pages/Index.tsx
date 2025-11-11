import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoRow from "@/components/VideoRow";

const mockVideos = [
  { id: "1", title: "Matemática Básica", thumbnail: "", ageRating: "Infantil" },
  { id: "2", title: "Ciências Naturais", thumbnail: "", ageRating: "Infantil" },
  { id: "3", title: "História do Brasil", thumbnail: "", ageRating: "Jovem" },
  { id: "4", title: "Física Moderna", thumbnail: "", ageRating: "Adulto" },
  { id: "5", title: "Inglês Avançado", thumbnail: "", ageRating: "Adulto" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <VideoRow title="Continue Assistindo" videos={mockVideos.slice(0, 3)} />
      <VideoRow title="Conteúdo Infantil" videos={mockVideos.filter(v => v.ageRating === "Infantil")} />
      <VideoRow title="Conteúdo Jovem" videos={mockVideos.filter(v => v.ageRating === "Jovem")} />
      <VideoRow title="Conteúdo Adulto" videos={mockVideos.filter(v => v.ageRating === "Adulto")} />
    </div>
  );
};

export default Index;
