import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useApi = () => {
  const { token, logout } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Sessão expirada. Faça login novamente.");
          logout();
          return;
        }
        throw new Error(data.error || "Erro na requisição");
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao conectar com servidor";
      toast.error(message);
      throw error;
    }
  };

  return { fetchApi };
};
