import axios, { setTokens, getAccessToken } from "../shared/axios";

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export async function loginApi(data: LoginRequest) {
  const res = await axios<{ accessToken: string; refreshToken: string }>({
    url: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/login",
    method: "POST",
    data,
  });
  setTokens({ access: res.data.accessToken, refresh: res.data.refreshToken });
  return res.data;
}

export async function registerApi(data: RegisterRequest) {
  const res = await axios<{
    username: string;
    email: string;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
  }>({
    url: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/register",
    method: "POST",
    data,
  });
  return res.data;
}

export function isLoggedIn() {
  return !!getAccessToken();
}
