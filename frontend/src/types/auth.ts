export type UserRole = 'PATIENT' | 'DONOR' | 'HOSPITAL' | 'ADMIN';

export interface AuthUser {
  id: number | string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
  id: number | string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'PATIENT' | 'DONOR';
  phone?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}
