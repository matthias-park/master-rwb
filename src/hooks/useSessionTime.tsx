import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Lockr from 'lockr';
import { useAuth } from '../hooks/useAuth';
import { LocalStorageKeys } from '../constants';

dayjs.extend(duration);

const useSessionTimer = (
  localStorageKey = LocalStorageKeys.sessionStart,
): plugin.Duration | null => {
  const key = localStorageKey || LocalStorageKeys.sessionStart;
  const { user } = useAuth();
  const intervalRef = useRef<number | null>(null);
  const sessionStart = Lockr.get(key) as string;
  const [diff, setDiff] = useState<plugin.Duration | null>(null);

  useEffect(() => {
    if (!user.logged_in) return;
    if (!sessionStart) Lockr.set(key, dayjs());
    const updateTimer = () => {
      const latestSessionDetails = Lockr.get(key) as string;
      const timeDiff = dayjs().diff(latestSessionDetails);
      setDiff(dayjs.duration(timeDiff));
    };
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => {
      clearInterval(intervalRef.current as number);
      if (!user.logged_in) {
        Lockr.rm(key);
      }
    };
  }, []);

  return diff;
};

export default useSessionTimer;
