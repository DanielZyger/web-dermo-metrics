import { useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import { User } from "../utils/types/user";

export const useUserWithLocalStorage = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const fetchUser = async (token: string) => {
    if (!token) return;

    // Verifica se já tem o usuário armazenado
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken === token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        return userData;
      } catch {
        // Se der erro no parse, busca novamente
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();

        // Salva no localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);

        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, fetchUser, logout };
};
