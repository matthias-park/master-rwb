import React from 'react';
import ApiHead from './ApiHead';
import ContextProviders from './ContextProviders';
import * as Sentry from '@sentry/react';

const App = ({ children }) => {
  return (
    <ContextProviders>
      <ApiHead />
      {children}
    </ContextProviders>
  );
};

export default Sentry.withProfiler(App);
