// Local database types until Supabase types are regenerated
export type AgeGroup = 'infantil' | 'jovem' | 'adulto';
export type AppRole = 'admin' | 'moderator' | 'user';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  age_group: AgeGroup;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  age_rating: AgeGroup;
  duration_minutes: number | null;
  release_year: number | null;
  is_interactive: boolean;
  created_at: string;
  updated_at: string;
}

export interface WatchProgress {
  id: string;
  user_id: string;
  video_id: string;
  progress_seconds: number;
  duration_seconds: number;
  completed: boolean;
  updated_at: string;
}
