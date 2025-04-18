import { useCallback, useRef, useEffect } from "react";

export function useDebouncedCallback(callback: any, delay: number = 200) {
  const timeoutId = useRef(null) as any;

  const debouncedCallback = useCallback(
    (...args: any) => {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  return debouncedCallback;
}