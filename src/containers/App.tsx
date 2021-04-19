import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './pages';
import { useConfig } from '../hooks/useConfig';
import ApiHead from './ApiHead';
import PageLayout from './pageLayout';
import Modals from './Modals';
import { UIConfigProvider } from '../hooks/useUIConfig';
import { ModalProvider } from '../hooks/useModal';

const App = () => {
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);

  return (
    <BrowserRouter key={locale} basename={`/${locale}`}>
      <ModalProvider>
        <UIConfigProvider>
          <ApiHead />
          <Modals />
          <PageLayout>
            <Routes />
          </PageLayout>
        </UIConfigProvider>
      </ModalProvider>
    </BrowserRouter>
  );
};

export default App;
