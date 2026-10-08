import apiClient from './client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@/types/auth';

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/api/auth/login',
    data
  );

  return response.data;
}

export async function register(
  data: RegisterRequest
): Promise<unknown> {
  const response = await apiClient.post(
    '/api/auth/register',
    data
  );

  return response.data;
}