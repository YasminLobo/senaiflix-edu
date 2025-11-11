import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<"infantil" | "jovem" | "adulto">("jovem");
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Bem-vindo!",
          description: "Login realizado com sucesso"
        });
        navigate("/");
      } else {
        toast({
          title: "Erro",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
      }
    } else {
      if (!name) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos",
          variant: "destructive"
        });
        return;
      }
      
      const success = await signup(email, password, name, type);
      if (success) {
        toast({
          title: "Conta criada!",
          description: "Cadastro realizado com sucesso"
        });
        navigate("/");
      } else {
        toast({
          title: "Erro",
          description: "Email já cadastrado",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-primary">SENAIFLIX</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {isLogin ? "Entre na sua conta" : "Crie sua conta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="bg-secondary border-border"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-secondary border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Conta</Label>
                <Select value={type} onValueChange={(value: any) => setType(value)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infantil">Infantil</SelectItem>
                    <SelectItem value="jovem">Jovem</SelectItem>
                    <SelectItem value="adulto">Adulto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              {isLogin ? "Entrar" : "Criar Conta"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
