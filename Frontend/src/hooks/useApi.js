import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, ...dependencies]); // Re-fetch when user changes or dependencies change

  return { data, loading, error, refetch: () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  } };
};

// Specific API hooks
export const useDestinations = (query) => {
  return useApi(() => apiService.searchDestinations(query), [query]);
};

export const usePaths = (from, to) => {
  return useApi(() => apiService.getPaths(from, to), [from, to]);
};

export const useUserProfile = () => {
  return useApi(() => apiService.getProfile(), []);
};

export const useSearchHistory = () => {
  return useApi(() => apiService.getSearchHistory(), []);
};