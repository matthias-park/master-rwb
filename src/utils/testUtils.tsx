import React, { useEffect, useState } from 'react';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { SwrFetcherConfig } from './apiUtils';
import { ToastProvider } from 'react-toast-notifications';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import createStoreAsync from '../state';

const AllTheProviders = ({ children }) => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    createStoreAsync().then(store => setState(store));
  }, []);
  if (!state) return null;
  return (
    <Provider store={state}>
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
