import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AdminVideoUpload = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    age_rating: "infantil",
    duration: "",
    year: new Date().getFullYear().toString(),
    is_interactive: false
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de vídeo",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Upload video file
      const videoFileName = `${Date.now()}-${videoFile.name}`;
      const { error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile);

      if (videoError) throw videoError;

      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

      setUploadProgress(50);

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbnailFileName = `${Date.now()}-${thumbnailFile.name}`;
        const { error: thumbnailError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, thumbnailFile);

        if (thumbnailError) throw thumbnailError;

        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(thumbnailFileName);
        
        thumbnailUrl = publicUrl;
      }

      setUploadProgress(75);

      // Create video record in database
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          title: formData.title,
          description: formData.description,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          age_rating: formData.age_rating,
          duration: formData.duration,
          year: parseInt(formData.year),
          is_interactive: formData.is_interactive
        });

      if (dbError) throw dbError;

      setUploadProgress(100);

      toast({
        title: "Sucesso!",
        description: "Vídeo enviado com sucesso. Processamento HLS iniciado.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        age_rating: "infantil",
        duration: "",
        year: new Date().getFullYear().toString(),
        is_interactive: false
      });
      setVideoFile(null);
      setThumbnailFile(null);
      setUploadProgress(0);

    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Upload de Vídeo</CardTitle>
        <CardDescription className="text-muted-foreground">
          Envie um novo vídeo para o catálogo. Os vídeos serão processados automaticamente para streaming HLS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="bg-input border-border text-foreground min-h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age_rating" className="text-foreground">Faixa Etária *</Label>
              <Select
                value={formData.age_rating}
                onValueChange={(value) => setFormData({ ...formData, age_rating: value })}
              >
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="infantil">Infantil</SelectItem>
                  <SelectItem value="jovem">Jovem</SelectItem>
                  <SelectItem value="adulto">Adulto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-foreground">Duração *</Label>
              <Input
                id="duration"
                placeholder="Ex: 45min"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-foreground">Ano *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_interactive"
              checked={formData.is_interactive}
              onCheckedChange={(checked) => setFormData({ ...formData, is_interactive: checked })}
            />
            <Label htmlFor="is_interactive" className="text-foreground">
              Vídeo Interativo (com perguntas)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video" className="text-foreground">Arquivo de Vídeo (MP4) *</Label>
            <Input
              id="video"
              type="file"
              accept="video/mp4"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              required
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-foreground">Thumbnail (opcional)</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="bg-input border-border text-foreground"
            />
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Enviando...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Vídeo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminVideoUpload;
