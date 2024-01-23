import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { LocalStorageKeys, ThemeSettings } from '../constants';
import clsx from 'clsx';
import useSessionTimer from '../hooks/useSessionTime';

dayjs.extend(duration);

const SessionTimer = ({
  className,
  needsClock,
  localStorageKey,
}: {
  className?: string;
  needsClock?: boolean;
  localStorageKey?: LocalStorageKeys;
}) => {
  const { icons: icon } = ThemeSettings!;
  const diff = useSessionTimer(
    localStorageKey || LocalStorageKeys.sessionStart,
  );
  const [currentTimer, setCurrentTimer] = useState<string>('00:00:00');

  useEffect(() => {
    setCurrentTimer(diff?.format('HH:mm:ss') || '00:00:00');
  }, [diff]);

  return (
    <>
      {needsClock && <i className={clsx('mr-1', icon?.clock)} />}
      <span className={className}>{currentTimer}</span>
    </>
  );
};

export default SessionTimer;
