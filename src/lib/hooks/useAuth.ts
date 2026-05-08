import useAuthStore from "@/lib/store/authStore"

export function useAuth() {
  const { user, isLoading, isAuthenticated, error } = useAuthStore()

  const hasRole = (roleNames: string | string[]): boolean => {
    if (!user) return false
    const roles = Array.isArray(roleNames) ? roleNames : [roleNames]
    return roles.some((name) =>
      user.roles.some((r) => r.toLowerCase() === name.toLowerCase())
    )
  }

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false
    return user.permissions.some(
      (p) =>
        p.resource.toLowerCase() === resource.toLowerCase() &&
        p.action.toLowerCase() === action.toLowerCase()
    )
  }

  const hasAnyPermission = (
    permissions: { resource: string; action: string }[]
  ): boolean => {
    if (!user) return false
    return permissions.some((p) => hasPermission(p.resource, p.action))
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    hasRole,
    hasPermission,
    hasAnyPermission,
  }
}
