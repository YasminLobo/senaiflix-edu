import { Card } from "@/components/ui/card";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  ageRating: string;
}

const VideoCard = ({ title, thumbnail, ageRating }: VideoCardProps) => {
  return (
    <Card className="group relative overflow-hidden rounded-md transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-primary cursor-pointer bg-card border-border">
      <div className="aspect-video bg-secondary flex items-center justify-center">
        <span className="text-muted-foreground text-sm">{ageRating}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{ageRating}</p>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
