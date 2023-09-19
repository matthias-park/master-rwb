import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);
const startTime = dayjs();

const CurrentTimeTimer = ({
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  timeFormat = 'HH:mm:ss',
}: {
  timezone?: string;
  timeFormat?: string;
}) => {
  const intervalRef = useRef(0);
  const [currentTimer, setCurrentTimer] = useState<string>(
    startTime.tz(timezone).format(timeFormat),
  );

  useEffect(() => {
    const updateTimer = () => {
      setCurrentTimer(dayjs().tz(timezone).format(timeFormat));
    };
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return <>{currentTimer}</>;
};

export default CurrentTimeTimer;
