"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import { supabase } from "@/database/supabase";

interface UserContextType {
  user: any | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userId: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);

        if (session?.user) {
          setUser(session.user);
          setUserId(session.user.id);

          // TODO Note: For RLS to work properly, you'll need to configure
          // Supabase to accept Better Auth JWTs or implement a
          // server-side proxy that adds proper auth headers
        } else {
          setUser(null);
          setUserId(null);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    if (!isPending) {
      loadUser();
    }
  }, [session, isPending]);

  const refreshUser = async () => {
    // Refresh user data if needed
    if (session?.user) {
      setUser(session.user);
      setUserId(session.user.id);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        loading: loading || isPending,
        error,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
