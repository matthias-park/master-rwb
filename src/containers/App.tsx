import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Routes from './pages';
import { useConfig } from '../hooks/useConfig';
import ApiHead from './ApiHead';
import ResponsibleGamblingModal from '../components/modals/ResponsibleGamblingModal';
import PageLayout from './pageLayout';

const App = () => {
  const { locale } = useConfig();
  return (
    <BrowserRouter basename={`/${locale}`}>
      <ApiHead />
      <ResponsibleGamblingModal />
      <PageLayout>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </PageLayout>
    </BrowserRouter>
  );
};

export default App;
