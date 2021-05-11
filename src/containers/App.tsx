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
import { CaptchaProvider } from '../hooks/useGoogleRecaptcha';

const App = () => {
  const { locale } = useConfig((prev, next) => !!prev.locale === !!next.locale);

  return (
    <BrowserRouter key={locale} basename={locale ? `/${locale}` : undefined}>
      <ModalProvider>
        <UIConfigProvider>
          <CaptchaProvider>
            <KambiProvider>
              <ApiHead />
              <Modals />
              <PageLayout>
                <Routes />
              </PageLayout>
            </KambiProvider>
          </CaptchaProvider>
        </UIConfigProvider>
      </ModalProvider>
    </BrowserRouter>
  );
};

export default App;
