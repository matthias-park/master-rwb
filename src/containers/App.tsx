import React from 'react';
import Routes from './pages';
import ApiHead from './ApiHead';
import PageLayout from './pageLayout';
import Modals from './Modals';
import ContextProviders from './ContextProviders';

const App = () => {
  return (
    <ContextProviders>
      <ApiHead />
      <Modals />
      <PageLayout>
        <Routes />
      </PageLayout>
    </ContextProviders>
  );
};

export default App;
