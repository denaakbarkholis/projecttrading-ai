import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client"; 
import { Session } from "@supabase/supabase-js";

export default function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setLoading(false);
    });
    // Listen for changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}