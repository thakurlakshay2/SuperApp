interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface LoginResponse {
  username: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

// API Configuration - Using Next.js API Routes
const API_BASE_URL = "/api/auth";
// API Functions
const authAPI = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Login API Error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
      };
    }
  },

  async register(data: RegisterRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Register API Error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
      };
    }
  },
};
