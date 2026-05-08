"use client"

import React, { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { User } from "@/lib/types/authTypes"
import { getCurrentUser } from "@/lib/api/auth/userApi"
import useAuthStore from "@/lib/store/authStore"
import { useAuth } from "@/lib/hooks/useAuth"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setUser, clearAuth, setLoading } = useAuthStore()

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, err) => {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") return false
      return failureCount < 3
    },
  })

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  useEffect(() => {
    if (user) {
      setUser(user)
    } else if (error) {
      clearAuth()
    }
  }, [user, error, setUser, clearAuth])

  return <>{children}</>
}

export const useRBAC = useAuth
