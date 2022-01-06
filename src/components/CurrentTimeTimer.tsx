import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
const startTime = dayjs();

const CurrentTimeTimer = ({
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: {
  timezone?: string;
}) => {
  const intervalRef = useRef(0);
  const [currentTimer, setCurrentTimer] = useState<string>(
    startTime.tz(timezone).format('HH:mm:ss'),
  );

  useEffect(() => {
    const updateTimer = () => {
      setCurrentTimer(dayjs().tz(timezone).format('HH:mm:ss'));
    };
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return <>{currentTimer}</>;
};

export default CurrentTimeTimer;
