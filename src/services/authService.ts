import { supabase } from '../api/supabase';
import type { LoginCredentials, SignupCredentials, User } from '../types/User';

export const authService = {
  async signInWithPassword(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return data;
  },

  async signUpWithPassword(credentials: SignupCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { full_name: credentials.full_name || '' },
        emailRedirectTo: `${window.location.origin}/#/auth/callback`,
      },
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: credentials.full_name || '',
      });

      if (profileError) {
        console.error('Failed to create profile:', profileError);
      }
    }

    return data;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      if (!profile) {
        try {
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
          });
        } catch (err) {
          console.error('Failed to create profile:', err);
        }
      }

      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        phone: '',
        address: '',
        favorite_genres: [],
      };
    }

    return {
      id: profile.id,
      email: profile.email || user.email || '',
      full_name: profile.full_name || '',
      avatar_url: profile.avatar_url || '',
      phone: profile.phone || '',
      address: profile.address || '',
      favorite_genres: profile.favorite_genres || [],
    };
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          try {
            await supabase.from('profiles').insert({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || '',
            });
          } catch (err) {
            console.error('Failed to create profile on sign in:', err);
          }
        }

        const user = await this.getCurrentUser();
        callback(user);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  },
};
