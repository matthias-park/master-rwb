import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './pages';
import { useConfig } from '../hooks/useConfig';
import ApiHead from './ApiHead';
import PageLayout from './pageLayout';
import Modals from './Modals';

const App = () => {
  const { locale } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    return localeEqual;
  });
  return (
    <BrowserRouter basename={`/${locale}`}>
      <ApiHead />
      <Modals />
      <PageLayout>
        <Routes />
      </PageLayout>
    </BrowserRouter>
  );
};

export default App;
