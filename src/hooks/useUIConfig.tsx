import React, { useState, createContext, useContext, useEffect } from 'react';
import UIConfig from '../types/UIConfig';
import {
  changeBackdropVisibility,
  createBackdropProviderValues,
} from '../utils/uiUtils';
import { UIBackdropState } from '../types/UIConfig';

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

  useEffect(() => {
    changeBackdropVisibility(backdrop.active);
  }, [backdrop]);

  const value: UIConfig = {
    backdrop: createBackdropProviderValues(backdrop, setBackdrop),
  };
  return <uiConfig.Provider value={value}>{props.children}</uiConfig.Provider>;
};
