import { useRef, useState } from 'react';

const useCountdownTicker = (amount: number) => {
  const countdownAmount = amount;
  const [countdownTime, setCountdownTime] = useState(countdownAmount);
  const countdownTimeRef = useRef(countdownAmount);
  const countdownTicker = useRef(countdownAmount);
  const [showCountdown, setShowCountdown] = useState(false);

  const progressTime = () => {
    setCountdownTime(prev => prev - 1);
    countdownTimeRef.current--;
    if (countdownTimeRef.current === 0) {
      clearInterval(countdownTicker.current);
      setCountdownTime(countdownAmount);
      countdownTimeRef.current = countdownAmount;
      setShowCountdown(false);
    }
  };

  const startCountDown = () => {
    setShowCountdown(true);
    countdownTicker.current = setInterval(progressTime, 1000);
  };

  return {
    startCountDown,
    countdownTime,
    showCountdown,
  };
};

export default useCountdownTicker;
