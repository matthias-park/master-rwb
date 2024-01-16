import React, { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import useLocalStorage from '../hooks/useLocalStorage';
import { ThemeSettings } from '../constants';
import clsx from 'clsx';
import Lockr from 'lockr';

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
  const { icons: icon } = ThemeSettings!;
  const intervalRef = useRef<number | null>(null);
  const [currentTimer, setCurrentTimer] = useState<string>('00:00:00');
  const [sessionDetails] = useLocalStorage<null | Dayjs>(
    localStorageKey || 'session_details',
    null,
  );

  const backupSessionTimer = dayjs();
  useEffect(() => {
    const updateTimer = () => {
      if (!sessionDetails) {
        Lockr.set('session_details', dayjs());
      }
      const timeDiff = dayjs().diff(sessionDetails);
      setCurrentTimer(dayjs.duration(timeDiff).format('HH:mm:ss'));
    };
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRef.current as number);
  }, [sessionDetails]);

  return (
    <>
      {needsClock && <i className={clsx('mr-1', icon?.clock)} />}
      <span className={className}>{currentTimer}</span>
    </>
  );
};

export default SessionTimer;
