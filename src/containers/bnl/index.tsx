import React from 'react';
import Routes from './pages';
import PageLayout from './pageLayout';
import Modals from './Modals';
import indexApp from '../IndexApp';

indexApp(() => (
  <>
    <Modals />
    <PageLayout>
      <Routes />
    </PageLayout>
  </>
));
