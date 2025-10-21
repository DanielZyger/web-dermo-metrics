import { useState, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DeleteResponse {
  loading: boolean;
  error: string | null;
  deleteItem: (id: string | number) => Promise<boolean>;
}

export const useDelete = (endpoint: string): DeleteResponse => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = useCallback(
    async (id: string | number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        console.error(`Erro ao deletar item de ${endpoint}/${id}:`, err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  return {
    loading,
    error,
    deleteItem,
  };
};
