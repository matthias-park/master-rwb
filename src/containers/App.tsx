import loadable from '@loadable/component';
import React from 'react';
import ApiHead from './ApiHead';
import ContextProviders from './ContextProviders';
import * as Sentry from '@sentry/react';
import { Config } from '../constants';

const AsyncFranchise = (name: string) =>
  loadable(() =>
    import(`./${name}`).catch(() => {
      Sentry.captureMessage(
        `Could not load franchise - ${name}`,
        Sentry.Severity.Critical,
      );
      window.location.reload();
      return 'div';
    }),
  );

const App = () => {
  const franchiseTheme = Config.theme;
  const FranchiseIndex = franchiseTheme
    ? AsyncFranchise(franchiseTheme)
    : 'div';
  return (
    <ContextProviders>
      <ApiHead />
      <FranchiseIndex />
    </ContextProviders>
  );
};

export default App;
