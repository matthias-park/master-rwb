import React, { useState, createContext, useContext, useEffect } from 'react';
import UIConfig from '../types/UIConfig';
import {
  changeBackdropVisibility,
  createBackdropProviderValues,
} from '../utils/uiUtils';
import { UIBackdropState } from '../types/UIConfig';
import { ComponentName } from '../constants';
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
  const { header } = useConfig(
    (prev, next) => prev.header?.length === next.header?.length,
  );
  const location = useLocation();
  const [activeHeaderNav, setActiveHeaderNav] = useState<string | null>(null);
  const [backdrop, setBackdrop] = useState<UIBackdropState>({
    active: false,
    ignoredComponents: [],
  });
  const [showModal, setShowModal] = useState<ComponentName | null>(null);
  const headerNav = createHeaderNavProviderValues(
    activeHeaderNav,
    setActiveHeaderNav,
    `${location.pathname}${location.hash}`,
    header,
  );
  useEffect(() => {
    changeBackdropVisibility(backdrop.active);
  }, [backdrop]);

  useEffect(() => {
    if (!activeHeaderNav?.includes('click:')) {
      headerNav.toggle();
    }
  }, [location, header]);

  const value: UIConfig = {
    backdrop: createBackdropProviderValues(backdrop, setBackdrop),
    showModal: showModal,
    setShowModal: setShowModal,
    headerNav,
  };
  return <uiConfig.Provider value={value}>{props.children}</uiConfig.Provider>;
};
