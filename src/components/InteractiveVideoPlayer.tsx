import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  time: number; // tempo em segundos quando a pergunta aparece
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface InteractiveVideoPlayerProps {
  videoId: string;
  questions: Question[];
}

const InteractiveVideoPlayer = ({ videoId, questions }: InteractiveVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Simula o progresso do vídeo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !activeQuestion) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Verifica se há uma pergunta neste momento
          const questionAtTime = questions.find(
            q => q.time === newTime && !answeredQuestions.has(q.id)
          );
          
          if (questionAtTime) {
            setActiveQuestion(questionAtTime);
            setIsPlaying(false);
            return prev; // Pausa o tempo
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, activeQuestion, questions, answeredQuestions]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !activeQuestion) return;

    setShowResult(true);
    
    if (selectedAnswer === activeQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      toast({
        title: "Resposta Correta! 🎉",
        description: activeQuestion.explanation,
      });
    } else {
      toast({
        title: "Resposta Incorreta",
        description: activeQuestion.explanation,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      setAnsweredQuestions(prev => new Set([...prev, activeQuestion.id]));
      setActiveQuestion(null);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsPlaying(true);
    }, 3000);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Video Player Placeholder */}
      <div className="relative bg-secondary rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
        <div className="relative z-10 text-center space-y-4">
          {activeQuestion ? (
            <div className="text-foreground text-xl font-semibold">
              Pergunta Interativa!
            </div>
          ) : (
            <>
              <div className="text-6xl text-foreground/80">📚</div>
              <div className="text-foreground text-lg">
                Vídeo de Aprendizado Interativo
              </div>
              <div className="text-muted-foreground">
                Tempo: {formatTime(currentTime)}
              </div>
            </>
          )}
        </div>

        {/* Play/Pause Button */}
        {!activeQuestion && (
          <Button
            size="lg"
            onClick={togglePlay}
            className="absolute bottom-4 left-4 z-20"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
        )}

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentTime / 300) * 100}%` }}
          />
        </div>
      </div>

      {/* Score Display */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Pontuação: {score}/{questions.length}</span>
        <span>Perguntas respondidas: {answeredQuestions.size}/{questions.length}</span>
      </div>

      {/* Interactive Question Card */}
      {activeQuestion && (
        <Card className="p-6 border-2 border-primary animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                ?
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {activeQuestion.question}
                </h3>

                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                  disabled={showResult}
                  className="space-y-3"
                >
                  {activeQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        showResult
                          ? index === activeQuestion.correctAnswer
                            ? "border-green-500 bg-green-500/10"
                            : index === selectedAnswer
                            ? "border-red-500 bg-red-500/10"
                            : "border-border"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer text-foreground"
                      >
                        {option}
                      </Label>
                      {showResult && index === activeQuestion.correctAnswer && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {showResult && index === selectedAnswer && index !== activeQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {!showResult && (
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full mt-4"
                  >
                    Confirmar Resposta
                  </Button>
                )}

                {showResult && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    selectedAnswer === activeQuestion.correctAnswer
                      ? "bg-green-500/10 border border-green-500"
                      : "bg-red-500/10 border border-red-500"
                  }`}>
                    <p className="text-sm text-foreground">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      {!activeQuestion && answeredQuestions.size === 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Modo Interativo:</strong> Durante o vídeo, perguntas aparecerão para testar seu conhecimento. 
            O vídeo pausará automaticamente para você responder.
          </p>
        </Card>
      )}
    </div>
  );
};

export default InteractiveVideoPlayer;
