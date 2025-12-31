export interface Driver {
  driverId: string;
  dni: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
}

export interface CreateDriverRequest {
  dni: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateDriverRequest {
  dni: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
}
