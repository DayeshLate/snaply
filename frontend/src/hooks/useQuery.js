import { useState, useEffect, useCallback, useRef } from 'react';

// Lightweight TanStack Query compatible cache & orchestrator
class QueryCache {
  constructor() {
    this.cache = new Map();
    this.subscribers = new Map();
  }

  getKey(queryKey) {
    return Array.isArray(queryKey) ? JSON.stringify(queryKey) : String(queryKey);
  }

  getQueryData(queryKey) {
    const key = this.getKey(queryKey);
    const entry = this.cache.get(key);
    return entry ? entry.data : undefined;
  }

  setQueryData(queryKey, updater) {
    const key = this.getKey(queryKey);
    const prev = this.getQueryData(queryKey);
    const nextData = typeof updater === 'function' ? updater(prev) : updater;
    this.cache.set(key, { data: nextData, timestamp: Date.now() });

    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach((cb) => cb(nextData));
    }
    return nextData;
  }

  invalidateQueries(queryKey) {
    const prefix = this.getKey(queryKey);
    for (const [key] of this.cache) {
      if (key.startsWith(prefix.slice(0, -1))) {
        this.cache.delete(key);
        if (this.subscribers.has(key)) {
          this.subscribers.get(key).forEach((cb) => cb(undefined, true));
        }
      }
    }
  }

  subscribe(queryKey, callback) {
    const key = this.getKey(queryKey);
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    return () => {
      if (this.subscribers.has(key)) {
        this.subscribers.get(key).delete(callback);
      }
    };
  }
}

export const queryClient = new QueryCache();

export function useQuery({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 10000,
  initialData,
}) {
  const [data, setData] = useState(() => {
    const cached = queryClient.getQueryData(queryKey);
    return cached !== undefined ? cached : initialData;
  });
  const [isLoading, setIsLoading] = useState(() => data === undefined && enabled);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const result = await queryFn();
      if (!mountedRef.current) return;
      queryClient.setQueryData(queryKey, result);
      setData(result);
      setIsLoading(false);
    } catch (err) {
      if (!mountedRef.current) return;
      setIsError(true);
      setError(err);
      setIsLoading(false);
    }
  }, [queryFn, enabled, JSON.stringify(queryKey)]);

  useEffect(() => {
    mountedRef.current = true;
    const unsubscribe = queryClient.subscribe(queryKey, (newData, shouldRefetch) => {
      if (shouldRefetch) {
        fetchData();
      } else if (newData !== undefined) {
        setData(newData);
      }
    });

    const cached = queryClient.getQueryData(queryKey);
    if (cached === undefined && enabled) {
      fetchData();
    } else if (cached !== undefined) {
      setData(cached);
      setIsLoading(false);
    }

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [fetchData, enabled, JSON.stringify(queryKey)]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

export function useMutation({
  mutationFn,
  onMutate,
  onSuccess,
  onError,
  onSettled,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = async (variables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    let context = undefined;

    if (onMutate) {
      try {
        context = await onMutate(variables);
      } catch {
        // ignore
      }
    }

    try {
      const result = await mutationFn(variables);
      setData(result);
      setIsLoading(false);
      if (onSuccess) {
        await onSuccess(result, variables, context);
      }
      if (onSettled) {
        await onSettled(result, null, variables, context);
      }
      return result;
    } catch (err) {
      setIsError(true);
      setError(err);
      setIsLoading(false);
      if (onError) {
        await onError(err, variables, context);
      }
      if (onSettled) {
        await onSettled(null, err, variables, context);
      }
      throw err;
    }
  };

  return {
    mutate,
    mutateAsync: mutate,
    isLoading,
    isError,
    error,
    data,
  };
}

