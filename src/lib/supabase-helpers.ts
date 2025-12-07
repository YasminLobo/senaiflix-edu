import { supabase } from "@/integrations/supabase/client";
import { Profile, Video, WatchProgress, UserRole } from "@/types/database";

// Helper functions to work with Supabase until types are regenerated

export const getProfiles = async () => {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*');
  return { data: data as Profile[] | null, error };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return { data: data as Profile | null, error };
};

export const getVideos = async () => {
  const { data, error } = await (supabase as any)
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data as Video[] | null, error };
};

export const getVideo = async (videoId: string) => {
  const { data, error } = await (supabase as any)
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .maybeSingle();
  return { data: data as Video | null, error };
};

export const insertVideo = async (video: Partial<Video>) => {
  const { data, error } = await (supabase as any)
    .from('videos')
    .insert(video)
    .select()
    .single();
  return { data: data as Video | null, error };
};

export const deleteVideo = async (videoId: string) => {
  const { error } = await (supabase as any)
    .from('videos')
    .delete()
    .eq('id', videoId);
  return { error };
};

export const getWatchProgress = async (userId: string, videoId: string) => {
  const { data, error } = await (supabase as any)
    .from('watch_progress')
    .select('progress_seconds, duration_seconds')
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .maybeSingle();
  return { data: data as Pick<WatchProgress, 'progress_seconds' | 'duration_seconds'> | null, error };
};

export const upsertWatchProgress = async (progress: Partial<WatchProgress>) => {
  const { error } = await (supabase as any)
    .from('watch_progress')
    .upsert(progress, { onConflict: 'user_id,video_id' });
  return { error };
};

export const getUserRole = async (userId: string, role: string) => {
  const { data, error } = await (supabase as any)
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', role)
    .maybeSingle();
  return { data: data as Pick<UserRole, 'role'> | null, error };
};

export const countProfiles = async () => {
  const { count, error } = await (supabase as any)
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  return { count, error };
};

export const countVideos = async () => {
  const { count, error } = await (supabase as any)
    .from('videos')
    .select('*', { count: 'exact', head: true });
  return { count, error };
};

export const countWatchProgress = async () => {
  const { count, error } = await (supabase as any)
    .from('watch_progress')
    .select('*', { count: 'exact', head: true });
  return { count, error };
};

export const getVideosDuration = async () => {
  const { data, error } = await (supabase as any)
    .from('videos')
    .select('duration_minutes');
  return { data: data as { duration_minutes: number }[] | null, error };
};

export const getProfilesAgeGroup = async () => {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('age_group');
  return { data: data as { age_group: string }[] | null, error };
};
