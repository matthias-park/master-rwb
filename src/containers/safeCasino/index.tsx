import React from 'react';
import { useConfig } from '../../hooks/useConfig';
import { ConfigLoaded } from '../../types/Config';
import indexApp from '../IndexApp';

const Index = () => {
  const { configLoaded } = useConfig();
  if (configLoaded !== ConfigLoaded.Loaded) return null;
  return <div>SafeCasino placeholder</div>;
};

indexApp(() => <Index />);
