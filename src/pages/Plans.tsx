import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Plans = () => {
  const { plans, userPlan, upgradePlan } = usePlan();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectPlan = (planId: string) => {
    upgradePlan(planId as any);
    toast({
      title: "Plano atualizado!",
      description: `Você agora tem acesso ao plano ${plans.find(p => p.id === planId)?.name}`,
    });
    navigate("/");
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'premium':
        return <Crown className="w-8 h-8 text-accent" />;
      case 'basic':
        return <Zap className="w-8 h-8 text-accent" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Escolha seu Plano
            </h1>
            <p className="text-lg text-muted-foreground">
              Desbloqueie todo o potencial da plataforma educacional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = userPlan.plan === plan.id;
              const isPremium = plan.id === 'premium';

              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                    isPremium ? 'border-primary border-2 bg-card' : 'bg-card border-border'
                  }`}
                >
                  {isPremium && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                      Popular
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                      {getPlanIcon(plan.id)}
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/mês</span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        isCurrentPlan
                          ? 'bg-secondary text-secondary-foreground'
                          : isPremium
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                      }`}
                      onClick={() => !isCurrentPlan && handleSelectPlan(plan.id)}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? 'Plano Atual' : 'Selecionar Plano'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Informações do Seu Plano</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Plano Atual</p>
                <p className="text-lg font-semibold text-foreground">
                  {plans.find(p => p.id === userPlan.plan)?.name}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Validade</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(userPlan.expiryDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Downloads Usados</p>
                <p className="text-lg font-semibold text-foreground">
                  {userPlan.downloadsUsed} / {
                    plans.find(p => p.id === userPlan.plan)?.downloadLimit === -1
                      ? '∞'
                      : plans.find(p => p.id === userPlan.plan)?.downloadLimit
                  }
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Qualidade de Vídeo</p>
                <p className="text-lg font-semibold text-foreground">
                  {plans.find(p => p.id === userPlan.plan)?.videoQuality}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
