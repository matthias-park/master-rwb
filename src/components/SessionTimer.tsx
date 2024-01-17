import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { ThemeSettings } from '../constants';
import clsx from 'clsx';
import Lockr from 'lockr';
import { useAuth } from '../hooks/useAuth';

dayjs.extend(duration);

const SessionTimer = ({
  className,
  needsClock,
  localStorageKey,
}: {
  className?: string;
  needsClock?: boolean;
  localStorageKey?: string;
}) => {
  const { user } = useAuth();
  const { icons: icon } = ThemeSettings!;
  const intervalRef = useRef<number | null>(null);
  const [currentTimer, setCurrentTimer] = useState<string>('00:00:00');
  const sessionDetails = Lockr.get(
    localStorageKey || 'session_details',
  ) as string;

  const backupSessionTimer = dayjs();
  useEffect(() => {
    if (!sessionDetails) Lockr.set('session_details', dayjs());
    const updateTimer = () => {
      const latestSessionDetails = Lockr.get(
        localStorageKey || 'session_details',
      ) as string;
      const timeDiff = dayjs().diff(latestSessionDetails);
      setCurrentTimer(dayjs.duration(timeDiff).format('HH:mm:ss'));
    };
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    console.log('testing unmount outside if');
    return () => {
      console.log('testing unmount outside if');
      clearInterval(intervalRef.current as number);
      if (!user.logged_in) Lockr.rm('session_details');
    };
  }, []);

  if (!user.logged_in) return null;
  return (
    <>
      {needsClock && <i className={clsx('mr-1', icon?.clock)} />}
      <span className={className}>{currentTimer}</span>
    </>
  );
};

export default SessionTimer;
