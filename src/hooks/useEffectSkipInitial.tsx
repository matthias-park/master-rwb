import { useEffect, useRef } from 'react';

const useEffectSkipInitial = (callback: () => void, values: any[]) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      callback();
    }
  }, [...values]);
};

export default useEffectSkipInitial;
