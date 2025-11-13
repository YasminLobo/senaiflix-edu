import React, { createContext, useContext, useState, useEffect } from 'react';

export type PlanType = 'free' | 'basic' | 'premium';

interface Plan {
  id: PlanType;
  name: string;
  price: number;
  features: string[];
  downloadLimit: number;
  videoQuality: string;
}

interface UserPlan {
  plan: PlanType;
  expiryDate: string;
  downloadsUsed: number;
}

interface WatchLaterVideo {
  id: string;
  title: string;
  thumbnail: string;
  ageRating: string;
}

interface VideoRating {
  videoId: string;
  rating: number;
}

interface PlanContextType {
  userPlan: UserPlan;
  watchLater: WatchLaterVideo[];
  ratings: VideoRating[];
  plans: Plan[];
  upgradePlan: (planId: PlanType) => void;
  addToWatchLater: (video: WatchLaterVideo) => void;
  removeFromWatchLater: (videoId: string) => void;
  rateVideo: (videoId: string, rating: number) => void;
  downloadVideo: (videoId: string) => Promise<boolean>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const availablePlans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    features: ['Acesso limitado', 'Qualidade SD', '0 downloads/mês'],
    downloadLimit: 0,
    videoQuality: 'SD'
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 19.90,
    features: ['Acesso completo', 'Qualidade HD', '5 downloads/mês', 'Sem anúncios'],
    downloadLimit: 5,
    videoQuality: 'HD'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39.90,
    features: ['Acesso completo', 'Qualidade 4K', 'Downloads ilimitados', 'Sem anúncios', 'Acesso antecipado'],
    downloadLimit: -1,
    videoQuality: '4K'
  }
];

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPlan, setUserPlan] = useState<UserPlan>(() => {
    const stored = localStorage.getItem('userPlan');
    return stored ? JSON.parse(stored) : {
      plan: 'free',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      downloadsUsed: 0
    };
  });

  const [watchLater, setWatchLater] = useState<WatchLaterVideo[]>(() => {
    const stored = localStorage.getItem('watchLater');
    return stored ? JSON.parse(stored) : [];
  });

  const [ratings, setRatings] = useState<VideoRating[]>(() => {
    const stored = localStorage.getItem('ratings');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('userPlan', JSON.stringify(userPlan));
  }, [userPlan]);

  useEffect(() => {
    localStorage.setItem('watchLater', JSON.stringify(watchLater));
  }, [watchLater]);

  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  const upgradePlan = (planId: PlanType) => {
    setUserPlan({
      plan: planId,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      downloadsUsed: 0
    });
  };

  const addToWatchLater = (video: WatchLaterVideo) => {
    if (!watchLater.find(v => v.id === video.id)) {
      setWatchLater([...watchLater, video]);
    }
  };

  const removeFromWatchLater = (videoId: string) => {
    setWatchLater(watchLater.filter(v => v.id !== videoId));
  };

  const rateVideo = (videoId: string, rating: number) => {
    const existingIndex = ratings.findIndex(r => r.videoId === videoId);
    if (existingIndex >= 0) {
      const newRatings = [...ratings];
      newRatings[existingIndex] = { videoId, rating };
      setRatings(newRatings);
    } else {
      setRatings([...ratings, { videoId, rating }]);
    }
  };

  const downloadVideo = async (videoId: string): Promise<boolean> => {
    const plan = availablePlans.find(p => p.id === userPlan.plan);
    if (!plan) return false;

    if (plan.downloadLimit === 0) {
      return false;
    }

    if (plan.downloadLimit > 0 && userPlan.downloadsUsed >= plan.downloadLimit) {
      return false;
    }

    setUserPlan({
      ...userPlan,
      downloadsUsed: userPlan.downloadsUsed + 1
    });

    return true;
  };

  return (
    <PlanContext.Provider
      value={{
        userPlan,
        watchLater,
        ratings,
        plans: availablePlans,
        upgradePlan,
        addToWatchLater,
        removeFromWatchLater,
        rateVideo,
        downloadVideo
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
