import { useEffect } from 'react';

const useVirtualKeyboard = (handler: () => void) => {
  useEffect(() => {
    Array.from(document.querySelectorAll('input')).forEach(input => {
      input.addEventListener('focus', () => handler());
      input.addEventListener('focusout', () => handler());
    });
  });
};

export default useVirtualKeyboard;
