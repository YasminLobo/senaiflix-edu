import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Video {
  id: string;
  title: string;
  description: string;
  age_rating: string;
  duration: string;
  year: number;
  thumbnail_url: string | null;
  is_interactive: boolean;
}

const AdminVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar vídeos",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setVideos(data || []);
  };

  const handleDelete = async () => {
    if (!deleteVideoId) return;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', deleteVideoId);

    if (error) {
      toast({
        title: "Erro ao deletar vídeo",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Vídeo deletado",
      description: "O vídeo foi removido com sucesso"
    });

    setDeleteVideoId(null);
    loadVideos();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Gestão de Vídeos</h2>
        <p className="text-muted-foreground">{videos.length} vídeos no catálogo</p>
      </div>

      <div className="grid gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="bg-card border-border">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-32 h-20 bg-secondary rounded flex items-center justify-center flex-shrink-0">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <Eye className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{video.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {video.description}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">
                    {video.age_rating}
                  </span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">
                    {video.duration}
                  </span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">
                    {video.year}
                  </span>
                  {video.is_interactive && (
                    <span className="text-xs bg-accent px-2 py-1 rounded text-accent-foreground">
                      Interativo
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-border text-foreground hover:bg-secondary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-border text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteVideoId(video.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteVideoId} onOpenChange={() => setDeleteVideoId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja deletar este vídeo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminVideos;
