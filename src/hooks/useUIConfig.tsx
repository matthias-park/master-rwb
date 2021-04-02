import React, { useState, createContext, useContext, useEffect } from 'react';
import UIConfig from '../types/UIConfig';
import {
  changeBackdropVisibility,
  createBackdropProviderValues,
  removePageLoadingSpinner,
} from '../utils/uiUtils';
import { UIBackdropState } from '../types/UIConfig';
import { ComponentName } from '../constants';
import { useConfig } from './useConfig';
import { useLocation } from 'react-router';
import { createHeaderNavProviderValues } from '../utils/uiUtils';
import { useI18n } from './useI18n';
import { ConfigLoaded } from '../types/Config';

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
  const { header, configLoaded, locale } = useConfig((prev, next) => {
    const headerEqual = prev.header?.length === next.header?.length;
    const configLoadedEqual = prev.configLoaded === next.configLoaded;
    const localeEqual = prev.locale === next.locale;
    return headerEqual && configLoadedEqual && localeEqual;
  });
  const { table } = useI18n();
  const location = useLocation();
  const [activeHeaderNav, setActiveHeaderNav] = useState<string | null>(null);
  const [initPageSpinner, setInitPageSpinner] = useState<boolean>(true);
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
    changeBackdropVisibility(initPageSpinner || backdrop.active);
  }, [backdrop, initPageSpinner]);

  useEffect(() => {
    if (
      [ConfigLoaded.Loaded, ConfigLoaded.Error].includes(configLoaded) &&
      (!locale || Object.keys(table()).length)
    ) {
      removePageLoadingSpinner();
      setInitPageSpinner(false);
    }
  }, [configLoaded, table]);

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
