import { useCallback, useEffect, useRef } from 'react';
import { CustomWindowEvents } from '../constants';
import { stringToMiliseconds } from '../utils';
import Lockr from 'lockr';

const frTimeoutConfig = window.__config__.componentSettings?.userIdleTimeout;
const useIdleTicker = (active: boolean, timeoutCallback: () => void) => {
  const idleTime = useRef<number>(0); // in minutes
  const idleTicker = useRef<number>(0);
  const resetTime = useCallback(() => {
    idleTime.current = 0;
  }, []);
  const addTimeIdle = () => {
    idleTime.current++;
    if (frTimeoutConfig && idleTime.current > frTimeoutConfig) {
      timeoutCallback();
      clearInterval(idleTicker.current);
      idleTime.current = 0;
    }
    console.log(`user idle timer: ${idleTime.current}min`);
  };

  useEffect(() => {
    if (active && frTimeoutConfig) {
      idleTime.current = 0;
      window.addEventListener('click', resetTime, { passive: true });
      window.addEventListener('scroll', resetTime, { passive: true });
      window.addEventListener(CustomWindowEvents.ResetIdleTimer, resetTime);
      const tickerInterval = stringToMiliseconds(
        Lockr.get('idleTickerInterval', '0:01:0'),
      );
      idleTicker.current = setInterval(addTimeIdle, tickerInterval);
    }
    return () => {
      if (active && frTimeoutConfig) {
        window.removeEventListener('click', resetTime);
        window.removeEventListener('scroll', resetTime);
        window.removeEventListener(
          CustomWindowEvents.ResetIdleTimer,
          resetTime,
        );
        clearInterval(idleTicker.current);
      }
    };
  }, [active]);
};

export default useIdleTicker;
