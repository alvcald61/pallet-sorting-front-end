"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { User, RBACContextType } from "@/lib/types/authTypes";
import { getCurrentUser } from "@/lib/api/auth/userApi";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@/lib/store/userStore";

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setCurrentUser, clearUser } = useUserStore();

  const { data: user = null, isLoading, error } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, err) => {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") return false;
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else if (error) {
      clearUser();
    }
  }, [user, error, setCurrentUser, clearUser]);

  const value: RBACContextType = useMemo(() => {
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

    return {
      user,
      roles: user?.roles || [],
      permissions: user?.permissions || [],
      hasRole,
      hasPermission,
      hasAnyPermission,
      loading: isLoading,
      error: error instanceof Error ? error.message : null,
    };
  }, [user, isLoading, error]);

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error("useRBAC debe usarse dentro de RBACProvider");
  }
  return context;
};
