import React from 'react';
import { useConfig } from '../../hooks/useConfig';
import { ConfigLoaded } from '../../types/Config';

const App = () => {
  const { configLoaded } = useConfig();
  if (configLoaded !== ConfigLoaded.Loaded) return null;
  return <div>SafeCasino placeholder</div>;
};

export default App;
