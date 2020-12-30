import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
const startTime = dayjs();

const SessionTimer = () => {
  const intervalRef = useRef(0);
  const [currentTimer, setCurrentTimer] = useState<string>('00:00:00');

  useEffect(() => {
    const updateTimer = () => {
      const timeDiff = dayjs().diff(startTime);
      setCurrentTimer(dayjs.duration(timeDiff).format('HH:mm:ss'));
    };
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return <>{currentTimer}</>;
};

export default SessionTimer;
