import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBgBackdrop } from '../hooks/useBgBackdrop';

const BgBackdrop = () => {
  const portalDiv = document.getElementById('backdrop')!;
  const { bgBackdrop } = useBgBackdrop();

  useEffect(() => {
    if (bgBackdrop) document.querySelector('body')!.classList.add('modal-open');
    else document.querySelector('body')!.classList.remove('modal-open');
  }, [bgBackdrop]);
  return createPortal(
    <div className={`bg-overlay ${bgBackdrop && 'show'}`}></div>,
    portalDiv,
  );
};

export default BgBackdrop;
