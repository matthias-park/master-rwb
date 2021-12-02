import React from 'react';
import Routes from './pages';
import PageLayout from './pageLayout';
import Modals from './Modals';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import GlobalStyles from './components/styled/GlobalStyles';

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Modals />
    <PageLayout>
      <Routes />
    </PageLayout>
  </ThemeProvider>
);

export default App;
