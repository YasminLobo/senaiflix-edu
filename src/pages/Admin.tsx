import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminVideoUpload from "@/components/admin/AdminVideoUpload";
import AdminVideos from "@/components/admin/AdminVideos";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 md:px-8 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          Painel Administrativo
        </h1>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="videos">Gestão de Vídeos</TabsTrigger>
            <TabsTrigger value="upload">Upload de Vídeo</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="videos">
            <AdminVideos />
          </TabsContent>

          <TabsContent value="upload">
            <AdminVideoUpload />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
