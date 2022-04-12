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
import { useDispatch } from 'react-redux';
import { disableModal, enableModal } from '../state/reducers/modals';
import { ComponentName } from '../constants';

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
  const dispatch = useDispatch();
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
    const active = showPageLoader || backdrop.active;
    dispatch(
      active
        ? enableModal(ComponentName.PageBackdrop)
        : disableModal(ComponentName.PageBackdrop),
    );
    changeBackdropVisibility(active);
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
