import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './pages';
import ApiHead from './ApiHead';
import PageLayout from './pageLayout';
import Modals from './Modals';
import { UIConfigProvider } from '../hooks/useUIConfig';
import { ModalProvider } from '../hooks/useModal';
import { KambiProvider } from './KambiSportsbook';
import { useConfig } from '../hooks/useConfig';

const App = () => {
  const { locale } = useConfig((prev, next) => !!prev.locale === !!next.locale);

  return (
    <BrowserRouter key={locale} basename={locale ? `/${locale}` : undefined}>
      <ModalProvider>
        <UIConfigProvider>
          <KambiProvider>
            <ApiHead />
            <Modals />
            <PageLayout>
              <Routes />
            </PageLayout>
          </KambiProvider>
        </UIConfigProvider>
      </ModalProvider>
    </BrowserRouter>
  );
};

export default App;
