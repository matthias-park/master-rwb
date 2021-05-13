import { RefObject, useEffect, useState } from 'react';

const useHover = (ref: RefObject<Element>, enabled: boolean = true) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
      console.error('useHoverDirty expects a single ref argument.');
    }
  }
  const [value, setValue] = useState(false);

  if (
    value &&
    ref.current &&
    typeof ref.current.matches === 'function' &&
    ref.current.matches(':hover') === false
  ) {
    setValue(false);
  }

  useEffect(() => {
    const onMouseOver = () => setValue(true);
    const onMouseOut = () => setValue(false);
    const node = ref?.current;

    if (enabled && node) {
      node.addEventListener('mouseover', onMouseOver);
      node.addEventListener('mouseout', onMouseOut);
    }
    return () => {
      if (enabled && node) {
        node.removeEventListener('mouseover', onMouseOver);
        node.removeEventListener('mouseout', onMouseOut);
      }
    };
  }, [enabled]);

  return value;
};

export default useHover;
