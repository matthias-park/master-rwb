import loadable from '@loadable/component';
import React from 'react';
import ApiHead from './ApiHead';
import ContextProviders from './ContextProviders';

const AsyncFranchise = (name: string) =>
  loadable(() =>
    import(`./${name}`).catch(() => {
      window.location.reload();
      return 'div';
    }),
  );

const App = () => {
  const franchiseName = window.__config__.name;
  const FranchiseIndex = franchiseName
    ? AsyncFranchise(window.__config__.name)
    : 'div';
  return (
    <ContextProviders>
      <ApiHead />
      <FranchiseIndex />
    </ContextProviders>
  );
};

export default App;
