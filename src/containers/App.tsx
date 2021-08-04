import loadable from '@loadable/component';
import React from 'react';
import ApiHead from './ApiHead';
import ContextProviders from './ContextProviders';
import StateProvider from './StateProvider';

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
    <StateProvider>
      <ContextProviders>
        <ApiHead />
        <FranchiseIndex />
      </ContextProviders>
    </StateProvider>
  );
};

export default App;
