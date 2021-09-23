import React, { useState, createContext, useContext, useEffect } from 'react';
import UIConfig from '../types/UIConfig';
import {
  changeBackdropVisibility,
  createBackdropProviderValues,
} from '../utils/uiUtils';
import { UIBackdropState } from '../types/UIConfig';
import { useConfig } from './useConfig';
import { useLocation } from 'react-router';
import { createHeaderNavProviderValues } from '../utils/uiUtils';

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
  const { header, showPageLoader } = useConfig((prev, next) => {
    const headerEqual = prev.header?.length === next.header?.length;
    const pageLoaderEqual = prev.showPageLoader === next.showPageLoader;
    return headerEqual && pageLoaderEqual;
  });
  const location = useLocation();
  const [activeHeaderNav, setActiveHeaderNav] = useState<string | null>(null);
  const [backdrop, setBackdrop] = useState<UIBackdropState>({
    active: false,
    ignoredComponents: [],
  });
  const headerNav = createHeaderNavProviderValues(
    activeHeaderNav,
    setActiveHeaderNav,
    `${location.pathname}${location.hash}`,
    header,
  );
  useEffect(() => {
    changeBackdropVisibility(showPageLoader || backdrop.active);
  }, [backdrop, showPageLoader]);

  useEffect(() => {
    headerNav.toggle();
  }, [location, header, headerNav]);

  const value: UIConfig = {
    backdrop: createBackdropProviderValues(backdrop, setBackdrop),
    headerNav,
  };
  return <uiConfig.Provider value={value}>{props.children}</uiConfig.Provider>;
};
