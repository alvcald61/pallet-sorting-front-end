export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Client {
  id: string;
  ruc: string;
  businessName: string;
  phone: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  trust: boolean;
  roles: Role[];
  enabled?: boolean;
  trusted?: boolean;
}

export interface CreateClientRequest {
  ruc: string;
  businessName: string;
  phone: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[]; // Array de IDs de roles
}

export interface UpdateClientRequest {
  ruc: string;
  businessName: string;
  phone: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[]; // Array de IDs de roles
}
