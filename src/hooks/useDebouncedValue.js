import { useEffect, useState } from 'react';
/** Evita filtrar a cada tecla digitada e centraliza o atraso na camada de estado. */
export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
}
