import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './pages';
import ApiHead from './ApiHead';
import PageLayout from './pageLayout';
import Modals from './Modals';
import { UIConfigProvider } from '../hooks/useUIConfig';
import { ModalProvider } from '../hooks/useModal';
import { useI18n } from '../hooks/useI18n';

const App = () => {
  const { locale: translationLocale } = useI18n();
  const locale = translationLocale();

  return (
    <BrowserRouter key={locale} basename={locale ? `/${locale}` : undefined}>
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
