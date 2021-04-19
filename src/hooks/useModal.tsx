import React, { createContext, useContext, useState } from 'react';
import { ComponentName } from '../constants';

type ModalContextState = ComponentName[];
interface ModalContext {
  allActiveModals: ComponentName[];
  activeModal?: ComponentName;
  enableModal: (name: ComponentName) => void;
  disableModal: (name: ComponentName) => void;
}

export const modalContext = createContext<ModalContext | null>(null);

export function useModal(): ModalContext {
  const instance = useContext<ModalContext | null>(modalContext);
  if (!instance) {
    throw new Error(
      'There was an error getting UI Config instance from context',
    );
  }
  return instance;
}

export const ModalProvider = props => {
  const [modals, setModals] = useState<ModalContextState>([]);

  const enableModal = (name: ComponentName) => {
    if (name && !modals.includes(name)) {
      setModals([...modals, name]);
    }
  };

  const disableModal = (name: ComponentName) => {
    if (name && modals.includes(name)) {
      const elIndex = modals.indexOf(name);
      const newModals = [...modals];
      newModals.splice(elIndex, 1);
      setModals(newModals);
    }
  };

  const value = {
    allActiveModals: modals,
    activeModal: modals[0],
    enableModal,
    disableModal,
  };
  return (
    <modalContext.Provider value={value}>
      {props.children}
    </modalContext.Provider>
  );
};
