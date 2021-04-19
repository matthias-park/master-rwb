import React, { createContext, useContext, useReducer } from 'react';
import { ComponentName } from '../constants';

enum ModalContextActionType {
  ON,
  OFF,
}
interface ModalContextState {
  modals: ComponentName[];
}
interface ModalContext {
  activeModals: ComponentName[];
  isModalActive: (name: ComponentName) => boolean;
  enableModal: (name: ComponentName) => void;
  disableModal: (name: ComponentName) => void;
}
interface ModalContextAction {
  type: ModalContextActionType;
  name?: ComponentName;
}

const initialState: ModalContextState = {
  modals: [],
};

const reducer = (
  state: ModalContextState,
  { type, name }: ModalContextAction,
) => {
  const { modals } = state;
  switch (type) {
    case ModalContextActionType.ON: {
      if (name && !modals.includes(name)) {
        modals.push(name);
      }
      break;
    }
    case ModalContextActionType.OFF: {
      if (name && modals.includes(name)) {
        const elIndex = modals.indexOf(name);
        modals.splice(elIndex, 1);
      }
      break;
    }
  }
  return state;
};

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
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {
    activeModals: state.modals,
    isModalActive: (name: ComponentName) => state.modals[0] === name,
    enableModal: (name: ComponentName) =>
      dispatch({ type: ModalContextActionType.ON, name }),
    disableModal: (name: ComponentName) =>
      dispatch({ type: ModalContextActionType.OFF, name }),
  };
  return (
    <modalContext.Provider value={value}>
      {props.children}
    </modalContext.Provider>
  );
};
