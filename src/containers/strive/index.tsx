import React from 'react';
import Routes from './pages';
import PageLayout from './pageLayout';
import Modals from './Modals';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

const App = () => (
  <ThemeProvider theme={theme}>
    <Modals />
    <PageLayout>
      <Routes />
    </PageLayout>
  </ThemeProvider>
);

export default App;
