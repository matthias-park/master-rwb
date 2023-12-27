import React, { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAuth } from '../hooks/useAuth';
import useLocalStorage from '../hooks/useLocalStorage';

dayjs.extend(duration);

const SessionTimer = () => {
  const intervalRef = useRef<number | null>(null);
  const [currentTimer, setCurrentTimer] = useState<string>('00:00:00');
  const [sessionDetails, setSessionDetails] = useLocalStorage<null | {
    start?: Dayjs | undefined;
    token?: string | undefined;
  }>('session_details', null);
  const { user } = useAuth();

  useEffect(() => {
    const updateTimer = () => {
      const timeDiff = dayjs().diff(sessionDetails?.start);
      setCurrentTimer(dayjs.duration(timeDiff).format('HH:mm:ss'));
    };
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRef.current as number);
  }, [sessionDetails]);

  useEffect(() => {
    if (user.logged_in && sessionDetails?.token !== user.token) {
      setSessionDetails({
        start: dayjs(),
        token: user.token,
      });
    }
  }, [user.logged_in]);

  return <>{currentTimer}</>;
};

export default SessionTimer;
