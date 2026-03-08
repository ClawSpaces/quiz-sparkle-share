import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const lastCheckedUserId = useRef<string | null>(null);
  const initialSessionChecked = useRef(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      initialSessionChecked.current = true;
      // Only set loading=false if there's NO user (no role check needed)
      if (!session?.user) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.id !== lastCheckedUserId.current) {
      lastCheckedUserId.current = user.id;
      supabase
        .rpc("has_role", { _user_id: user.id, _role: "admin" })
        .then(({ data, error }) => {
          if (error) {
            console.error("has_role error:", error);
            setIsAdmin(false);
          } else {
            setIsAdmin(!!data);
          }
          setLoading(false);
        });
    } else if (!user && initialSessionChecked.current) {
      lastCheckedUserId.current = null;
      setIsAdmin(false);
      setLoading(false);
    }
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, isAdmin, loading, signOut };
}
