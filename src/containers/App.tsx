import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Routes from './pages';
import { useConfig } from '../hooks/useConfig';
import ApiHead from './ApiHead';
import PageLayout from './pageLayout';
import Modals from './Modals';

const App = () => {
  const { locale } = useConfig();
  return (
    <BrowserRouter basename={`/${locale}`}>
      <ApiHead />
      <Modals />
      <PageLayout>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </PageLayout>
    </BrowserRouter>
  );
};

export default App;
