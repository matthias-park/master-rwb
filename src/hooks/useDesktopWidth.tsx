import { useState, useEffect, useRef, useCallback } from 'react';

const isClient = typeof window === 'object';

const useDesktopWidth = (maxMobileWidth: number) => {
  const resizeId = useRef(0);
  const getIsDesktopWidth = useCallback(
    () => (isClient ? window.innerWidth > maxMobileWidth : false),
    [maxMobileWidth],
  );
  const [desktopWidth, setDesktopWidth] = useState(getIsDesktopWidth);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const doneResizing = () => {
      const isDesktopWidth = getIsDesktopWidth();
      setDesktopWidth(isDesktopWidth);
    };

    const handleResize = () => {
      const isSafari =
        !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

      if (isSafari) {
        clearTimeout(resizeId.current);
        resizeId.current = setTimeout(doneResizing, 500);
      } else {
        doneResizing();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [desktopWidth, getIsDesktopWidth]);

  return desktopWidth;
};

export default useDesktopWidth;
