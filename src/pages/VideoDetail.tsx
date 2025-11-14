import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Download, Clock, Star, ArrowLeft, Plus, Check, Code } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import VideoRow from "@/components/VideoRow";
import InteractiveVideoPlayer from "@/components/InteractiveVideoPlayer";

const mockVideos = [
  { id: "1", title: "Matemática Básica", thumbnail: "", ageRating: "Infantil", description: "Aprenda os fundamentos da matemática de forma divertida e interativa.", duration: "45min", year: "2024", isInteractive: false },
  { id: "2", title: "Ciências Naturais", thumbnail: "", ageRating: "Infantil", description: "Explore o mundo natural e descubra as maravilhas da ciência.", duration: "38min", year: "2024", isInteractive: false },
  { id: "3", title: "História do Brasil", thumbnail: "", ageRating: "Jovem", description: "Conheça os principais eventos que moldaram a história do Brasil.", duration: "52min", year: "2023", isInteractive: false },
  { id: "4", title: "Física Moderna", thumbnail: "", ageRating: "Adulto", description: "Mergulhe nos conceitos avançados da física contemporânea.", duration: "1h 15min", year: "2024", isInteractive: false },
  { id: "5", title: "Inglês Avançado", thumbnail: "", ageRating: "Adulto", description: "Domine o inglês com técnicas avançadas de conversação.", duration: "1h 5min", year: "2023", isInteractive: false },
  { id: "6", title: "Programação Python - Interativo", thumbnail: "", ageRating: "Adulto", description: "Aprenda Python de forma interativa com desafios de código em tempo real durante o vídeo.", duration: "1h 30min", year: "2024", isInteractive: true },
  { id: "7", title: "JavaScript Básico - Interativo", thumbnail: "", ageRating: "Jovem", description: "Aprenda os fundamentos do JavaScript com perguntas práticas durante a aula.", duration: "50min", year: "2024", isInteractive: true },
];

const interactiveQuestions = {
  "6": [
    {
      id: "q1",
      time: 30,
      question: "Qual é a palavra-chave usada para definir uma função em Python?",
      options: ["function", "def", "func", "define"],
      correctAnswer: 1,
      explanation: "Em Python, usamos 'def' para definir funções. Exemplo: def minha_funcao():"
    },
    {
      id: "q2",
      time: 90,
      question: "Como você imprime 'Olá Mundo' em Python?",
      options: ["echo('Olá Mundo')", "print('Olá Mundo')", "console.log('Olá Mundo')", "write('Olá Mundo')"],
      correctAnswer: 1,
      explanation: "A função print() é usada para exibir texto no console em Python."
    },
    {
      id: "q3",
      time: 150,
      question: "Qual tipo de dados é usado para armazenar números decimais em Python?",
      options: ["int", "decimal", "float", "double"],
      correctAnswer: 2,
      explanation: "O tipo 'float' é usado para números com casas decimais em Python."
    }
  ],
  "7": [
    {
      id: "q1",
      time: 25,
      question: "Como você declara uma variável em JavaScript?",
      options: ["var nome = 'João'", "variable nome = 'João'", "let nome := 'João'", "string nome = 'João'"],
      correctAnswer: 0,
      explanation: "Em JavaScript, usamos var, let ou const para declarar variáveis."
    },
    {
      id: "q2",
      time: 70,
      question: "Qual método é usado para adicionar um elemento ao final de um array?",
      options: ["add()", "append()", "push()", "insert()"],
      correctAnswer: 2,
      explanation: "O método push() adiciona um ou mais elementos ao final de um array."
    }
  ]
};

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchLater, removeFromWatchLater, watchLater, rateVideo, ratings, downloadVideo } = usePlan();
  const { toast } = useToast();
  
  const video = mockVideos.find(v => v.id === id);
  const [rating, setRating] = useState(ratings.find(r => r.videoId === id)?.rating || 0);
  const isInWatchLater = watchLater.some(v => v.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'info'>('overview');

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

  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlay = () => {
    if (video.isInteractive) {
      setShowPlayer(true);
    } else {
      toast({
        title: "Reproduzindo vídeo",
        description: "O player será implementado em breve",
      });
    }
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
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                {video.title}
              </h1>
              {video.isInteractive && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                  <Code className="h-4 w-4" />
                  Interativo
                </span>
              )}
            </div>
            
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

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 -mt-32 relative z-20">
        {/* Interactive Player */}
        {showPlayer && video.isInteractive && (
          <div className="mb-8">
            <InteractiveVideoPlayer 
              videoId={video.id}
              questions={interactiveQuestions[video.id as keyof typeof interactiveQuestions] || []}
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-border">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-border mb-6">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 transition-colors ${
                activeTab === 'overview' 
                  ? 'text-foreground border-b-2 border-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Visão Geral
            </button>
            <button 
              onClick={() => setActiveTab('info')}
              className={`pb-4 px-2 transition-colors ${
                activeTab === 'info' 
                  ? 'text-foreground border-b-2 border-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Informações
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Sobre</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {video.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-muted-foreground text-sm">Duração</span>
                  <p className="text-foreground font-medium">{video.duration}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Ano</span>
                  <p className="text-foreground font-medium">{video.year}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Classificação</span>
                  <p className="text-foreground font-medium">{video.ageRating}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Avaliação</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-foreground font-medium">
                      {rating > 0 ? rating : "Não avaliado"}
                    </span>
                  </div>
                </div>
              </div>

              {video.isInteractive && (
                <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">Conteúdo Interativo</h4>
                      <p className="text-sm text-muted-foreground">
                        Este vídeo contém perguntas interativas que pausarão automaticamente a reprodução 
                        para testar seu conhecimento. Responda corretamente para avançar no aprendizado!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Informações Detalhadas</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-muted-foreground">Título Original:</span>
                    <p className="text-foreground">{video.title}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sinopse Completa:</span>
                    <p className="text-foreground leading-relaxed">{video.description}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Categoria:</span>
                    <p className="text-foreground">Educacional - {video.ageRating}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <p className="text-foreground">
                      {video.isInteractive ? "Vídeo Interativo com Perguntas" : "Vídeo Educacional"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Idioma:</span>
                    <p className="text-foreground">Português (Brasil)</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Legendas:</span>
                    <p className="text-foreground">Português, Inglês, Espanhol</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Qualidade Disponível:</span>
                    <p className="text-foreground">SD, HD, 4K Ultra HD</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
