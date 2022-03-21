import { useRef, useEffect } from 'react';

const useOnUnload = (event: Function | undefined) => {
  const cb = useRef(event);

  useEffect(() => {
    cb.current = event;
  }, [event]);

  useEffect(() => {
    const onUnload = (...args) => cb.current?.(...args);

    window.addEventListener('beforeunload', onUnload);

    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);
};

export default useOnUnload;
