import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Video, Eye, HardDrive } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalViews: 0,
    storageUsed: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // Count profiles
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Count videos
    const { count: videosCount } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });

    // Count watch progress entries (views)
    const { count: viewsCount } = await supabase
      .from('watch_progress')
      .select('*', { count: 'exact', head: true });

    // Get storage usage (approximate)
    const { data: videos } = await supabase
      .from('videos')
      .select('video_url');

    setStats({
      totalUsers: usersCount || 0,
      totalVideos: videosCount || 0,
      totalViews: viewsCount || 0,
      storageUsed: videos?.length || 0 // Simplified - should calculate actual size
    });
  };

  const statsCards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      icon: Users,
      description: "Usuários registrados"
    },
    {
      title: "Total de Vídeos",
      value: stats.totalVideos,
      icon: Video,
      description: "Vídeos no catálogo"
    },
    {
      title: "Total de Visualizações",
      value: stats.totalViews,
      icon: Eye,
      description: "Vídeos assistidos"
    },
    {
      title: "Armazenamento",
      value: `${stats.storageUsed} vídeos`,
      icon: HardDrive,
      description: "Espaço utilizado"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Distribuição por Faixa Etária</CardTitle>
          <CardDescription className="text-muted-foreground">
            Usuários divididos por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgeGroupDistribution />
        </CardContent>
      </Card>
    </div>
  );
};

const AgeGroupDistribution = () => {
  const [distribution, setDistribution] = useState<Record<string, number>>({});

  useEffect(() => {
    loadDistribution();
  }, []);

  const loadDistribution = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('age_group');

    if (data) {
      const dist = data.reduce((acc, profile) => {
        acc[profile.age_group] = (acc[profile.age_group] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      setDistribution(dist);
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(distribution).map(([ageGroup, count]) => (
        <div key={ageGroup} className="flex items-center justify-between">
          <span className="text-foreground capitalize">{ageGroup}</span>
          <div className="flex items-center gap-4">
            <div className="w-48 bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${(count / Object.values(distribution).reduce((a, b) => a + b, 0)) * 100}%` }}
              />
            </div>
            <span className="text-foreground font-semibold w-12 text-right">{count}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
