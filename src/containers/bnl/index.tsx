import React from 'react';
import Routes from './pages';
import PageLayout from './pageLayout';
import Modals from './Modals';

const App = () => (
  <>
    <Modals />
    <PageLayout>
      <Routes />
    </PageLayout>
  </>
);

export default App;
