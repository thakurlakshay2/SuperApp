import _axios, {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";

// Simple in-memory token store (mirrored in cookies)
let accessToken: string | null = null;
let refreshToken: string | null = null;

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

export function setTokens(tokens: { access: string; refresh: string }) {
  accessToken = tokens.access;
  refreshToken = tokens.refresh;
  Cookies.set(ACCESS_COOKIE, tokens.access, {
    sameSite: "strict",
    secure: true,
  });
  Cookies.set(REFRESH_COOKIE, tokens.refresh, {
    sameSite: "strict",
    secure: true,
  });
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  Cookies.remove(ACCESS_COOKIE);
  Cookies.remove(REFRESH_COOKIE);
}

export function getAccessToken() {
  if (!accessToken) accessToken = Cookies.get(ACCESS_COOKIE) || null;
  return accessToken;
}

export function getRefreshToken() {
  if (!refreshToken) refreshToken = Cookies.get(REFRESH_COOKIE) || null;
  return refreshToken;
}

// Interceptor registry
const responseInterceptors: Record<
  number,
  ((
    error: AxiosError,
    originalRequest: AxiosRequestConfig,
    retry: () => Promise<AxiosResponse>
  ) => Promise<AxiosResponse | void> | void)[]
> = {};

export function addResponseInterceptor(
  status: number,
  handler: (
    error: AxiosError,
    originalRequest: AxiosRequestConfig,
    retry: () => Promise<AxiosResponse>
  ) => Promise<AxiosResponse | void> | void
) {
  if (!responseInterceptors[status]) responseInterceptors[status] = [];
  responseInterceptors[status].push(handler);
}

// Create a single axios instance
const instance: AxiosInstance = _axios.create();

// Response error interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    if (!status || !originalRequest) throw error;

    const retry = () => instance(originalRequest);
    const handlers = responseInterceptors[status] || [];
    for (const handler of handlers) {
      const result = await handler(error, originalRequest, retry);
      if (result) return result;
    }
    throw error;
  }
);

// 401 interceptor: refresh token and retry
addResponseInterceptor(401, async (error, originalRequest, retry) => {
  const refreshTokenVal = getRefreshToken();
  if (!refreshTokenVal) {
    if (typeof window !== "undefined") window.location.replace("/");
    return;
  }
  try {
    const resp = await instance.post<{ accessToken: string }>(
      "http://localhost:8082/api/auth/refresh",
      {},
      {
        headers: { Authorization: `Bearer ${refreshTokenVal}` },
      }
    );
    setTokens({ access: resp.data.accessToken, refresh: refreshTokenVal });
    if (originalRequest.headers) {
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${resp.data.accessToken}`;
    }
    return retry();
  } catch (refreshErr) {
    clearTokens();
    if (typeof window !== "undefined") window.location.replace("/");
    return;
  }
});

// Example 404 interceptor (can be customized)
addResponseInterceptor(404, async (error) => {
  // You can show a toast, redirect, etc.
  // e.g., window.location.href = '/not-found';
  return;
});

// Main API function
export interface SuperAppAxiosConfig<T = any> extends AxiosRequestConfig {
  authentication?: boolean;
}

export default function axios<T = any>(
  config: SuperAppAxiosConfig<T>
): AxiosPromise<T> {
  const token = config.authentication ? getAccessToken() : null;
  if (config.authentication && token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return instance(config) as AxiosPromise<T>;
}
