import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './pages';
import { useConfig } from '../hooks/useConfig';
import ApiHead from './ApiHead';
import PageLayout from './pageLayout';
import Modals from './Modals';
import { UIConfigProvider } from '../hooks/useUIConfig';

const App = () => {
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);

  return (
    <BrowserRouter key={locale} basename={`/${locale}`}>
      <UIConfigProvider>
        <ApiHead />
        <Modals />
        <PageLayout>
          <Routes />
        </PageLayout>
      </UIConfigProvider>
    </BrowserRouter>
  );
};

export default App;
