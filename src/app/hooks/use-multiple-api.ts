import { useCallback, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useMultipleApi = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchMultiple = useCallback(async (endpoints: string[]) => {
    setLoading(true);
    setErrors({});

    try {
      const promises = endpoints.map(endpoint => 
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(async response => {
          if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
          }
          return {
            endpoint,
            data: await response.json()
          };
        }).catch(error => ({
          endpoint,
          error: error.message
        }))
      );

      const results = await Promise.allSettled(promises);
      
      const successResults: Record<string, any[]> = {};
      const errorResults: Record<string, string> = {};

      results.forEach((result, index) => {
        const endpoint = endpoints[index];
        
        if (result.status === 'fulfilled') {
          const value = result.value as any;
          if (value.error) {
            errorResults[endpoint] = value.error;
          } else {
            successResults[endpoint] = value.data;
          }
        } else {
          errorResults[endpoint] = result.reason?.message || 'Erro desconhecido';
        }
      });

      setErrors(errorResults);
      return successResults;
    } catch (err) {
      console.error('Erro geral ao buscar dados:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchMultiple, loading, errors };
};
