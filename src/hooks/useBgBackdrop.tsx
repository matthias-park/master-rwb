import React, { useState, createContext, useContext } from 'react';

type Backdrop = {
  bgBackdrop: boolean;
  setBgBackdrop: (show: boolean) => void;
};

export const backdropContext = createContext<Backdrop | null>(null);

export function useBgBackdrop(): Backdrop {
  const instance = useContext<Backdrop | null>(backdropContext);
  if (!instance) {
    throw new Error('There was an error getting backdrop instance from context');
  }
  return instance;
}

export const BgBackdropProvider = props => {
  const [bgBackdrop, setBgBackdrop] = useState(false);

  return <backdropContext.Provider value={{ bgBackdrop: bgBackdrop, setBgBackdrop: setBgBackdrop }}>
          {props.children}
         </backdropContext.Provider>
}
