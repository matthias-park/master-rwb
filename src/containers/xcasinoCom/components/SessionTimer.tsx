import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import useLocalStorage from '../../../hooks/useLocalStorage';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import clsx from 'clsx';

dayjs.extend(duration);
const SessionTimer = ({ className }: { className?: string }) => {
  const intervalRef = useRef(0);
  const { user } = useAuth();
  const [currentTimer, setCurrentTimer] = useState<string>('00:00:00');

  const [sessionDetails, setSessionDetails] = useLocalStorage<null | {
    start?: Dayjs | undefined;
    token?: string | undefined;
  }>('session_details', null);

  useEffect(() => {
    if (user.logged_in && sessionDetails?.token !== user.token) {
      setSessionDetails({
        start: dayjs(),
        token: user.token,
      });
    }
  }, [user.logged_in]);

  useEffect(() => {
    const updateTimer = () => {
      const timeDiff = dayjs().diff(sessionDetails?.start);
      setCurrentTimer(dayjs.duration(timeDiff).format('HH:mm:ss'));
    };
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRef.current);
  }, [sessionDetails]);

  return user.logged_in ? (
    <span className={clsx('session-timer', className)}>
      <i className="icon-live-sports session-timer__icon"></i>
      <span>{currentTimer}</span>
    </span>
  ) : (
    <></>
  );
};

export default SessionTimer;
