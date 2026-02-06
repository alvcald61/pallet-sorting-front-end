"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, RBACContextType } from "@/lib/types/authTypes";
import { getCurrentUser } from "@/lib/api/auth/userApi";
import { useRouter } from "next/navigation";
import useUserStore from "@/lib/store/userStore";

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setCurrentUser, currentUser, clearUser } = useUserStore();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Obtener token de la cookie (será enviada automáticamente por el navegador)
        // const response = await fetch("/api/auth/session", {
        //   method: "GET",
        //   credentials: "include",
        // });

        // if (!response.ok) {
        //   setUser(null);
        //   router.push("/login");
        //   return;
        // }

        // const sessionData = await response.json();
        const userData = await getCurrentUser();
        setCurrentUser(userData);
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al obtener datos del usuario"
        );
        setUser(null);
        clearUser();

        if (
          err instanceof Error &&
          err.message === "SESSION_EXPIRED"
        ) {
          window.location.href = "/login";
          return;
        }
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    if (!currentUser) fetchUser();
  }, [router]);

  const hasRole = (roleNames: string | string[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(roleNames) ? roleNames : [roleNames];
    return roles.some((roleName) =>
      user.roles.some((r) => r.toLowerCase() === roleName.toLowerCase())
    );
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    return user.permissions.some(
      (p) =>
        p.resource.toLowerCase() === resource.toLowerCase() &&
        p.action.toLowerCase() === action.toLowerCase()
    );
  };

  const hasAnyPermission = (
    permissions: { resource: string; action: string }[]
  ): boolean => {
    if (!user) return false;
    return permissions.some((p) => hasPermission(p.resource, p.action));
  };

  const value: RBACContextType = {
    user,
    roles: user?.roles || [],
    permissions: user?.permissions || [],
    hasRole,
    hasPermission,
    hasAnyPermission,
    loading,
    error,
  };

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error("useRBAC debe usarse dentro de RBACProvider");
  }
  return context;
};
