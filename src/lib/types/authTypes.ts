interface LoginResponse {
  accessToken: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: Permission[];
}

export interface SessionData {
  user: User;
  token: string;
  expiresAt: number;
}

export interface RBACContextType {
  user: User | null;
  roles: string[];
  permissions: Permission[];
  hasRole: (roleNames: string | string[]) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (
    permissions: { resource: string; action: string }[]
  ) => boolean;
  loading: boolean;
  error: string | null;
}
