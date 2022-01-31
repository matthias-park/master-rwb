import React from 'react';
import Routes from './pages';
import PageLayout from './pageLayout';
import Modals from './Modals';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import GlobalStyles from './components/styled/GlobalStyles';
import indexApp from '../IndexApp';

const Index = () => {
  const mobileView = useSelector((state: RootState) => state.config.mobileView);
  if (mobileView) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes />
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Modals />
      <PageLayout>
        <Routes />
      </PageLayout>
    </ThemeProvider>
  );
};
indexApp(() => <Index />);
