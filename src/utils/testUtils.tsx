import React from 'react';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { SwrFetcherConfig } from './apiUtils';
import { ToastProvider } from 'react-toast-notifications';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import store from '../state';

const AllTheProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <SWRConfig value={SwrFetcherConfig}>
        <ToastProvider>
          <HelmetProvider>{children}</HelmetProvider>
        </ToastProvider>
      </SWRConfig>
    </Provider>
  );
};

const customRender = (ui, options: any = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
