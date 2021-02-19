import React, { useState, createContext, useContext, useEffect } from 'react';
import UIConfig from '../types/UIConfig';
import {
  changeBackdropVisibility,
  createBackdropProviderValues,
} from '../utils/uiUtils';
import { UIBackdropState } from '../types/UIConfig';
import { createContentStylesProviderValues } from '../utils/uiUtils';

export const uiConfig = createContext<UIConfig | null>(null);

export function useUIConfig(): UIConfig {
  const instance = useContext<UIConfig | null>(uiConfig);
  if (!instance) {
    throw new Error(
      'There was an error getting UI Config instance from context',
    );
  }
  return instance;
}

export const UIConfigProvider = props => {
  const [backdrop, setBackdrop] = useState<UIBackdropState>({
    active: false,
    ignoredComponents: [],
  });
  const [contentStyles, setContentStyles] = useState<React.CSSProperties>({});
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    changeBackdropVisibility(backdrop.active);
  }, [backdrop]);

  const value: UIConfig = {
    backdrop: createBackdropProviderValues(backdrop, setBackdrop),
    contentStyle: createContentStylesProviderValues(
      contentStyles,
      setContentStyles,
    ),
    showModal: showModal,
    setShowModal: setShowModal,
  };
  return <uiConfig.Provider value={value}>{props.children}</uiConfig.Provider>;
};
