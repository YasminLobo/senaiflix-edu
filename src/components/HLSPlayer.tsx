import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface HLSPlayerProps {
  videoId: string;
  videoUrl: string;
}

const HLSPlayer = ({ videoId, videoUrl }: HLSPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Load saved progress
    if (user) {
      loadProgress();
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [videoId, user]);

  const loadProgress = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('watch_progress')
      .select('progress_seconds, duration_seconds')
      .eq('video_id', videoId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (data && videoRef.current) {
      videoRef.current.currentTime = data.progress_seconds;
      setProgress((data.progress_seconds / data.duration_seconds) * 100);
    }
  };

  const saveProgress = async () => {
    if (!user || !videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;

    await supabase
      .from('watch_progress')
      .upsert({
        user_id: user.id,
        video_id: videoId,
        progress_seconds: currentTime,
        duration_seconds: duration,
        completed: currentTime >= duration * 0.95
      }, {
        onConflict: 'user_id,video_id'
      });
  };

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        saveProgress();
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      } else {
        videoRef.current.play();
        // Save progress every 10 seconds
        progressIntervalRef.current = setInterval(() => {
          saveProgress();
        }, 10000);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-background rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          saveProgress();
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          size="icon"
          variant="secondary"
          className="h-16 w-16 rounded-full bg-secondary/80 hover:bg-secondary"
          onClick={handlePlay}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8 ml-1" />
          )}
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default HLSPlayer;
