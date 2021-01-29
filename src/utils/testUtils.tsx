import React from 'react';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { SwrFetcherConfig } from './apiUtils';
import { ToastProvider } from 'react-toast-notifications';
import { ConfigProvider } from '../hooks/useConfig';
import { I18nProvider } from '../hooks/useI18n';
import { HelmetProvider } from 'react-helmet-async';
import { UIConfigProvider } from '../hooks/useUIConfig';

const AllTheProviders = ({ children }) => {
  return (
    <SWRConfig value={SwrFetcherConfig}>
      <ToastProvider>
        <ConfigProvider>
          <I18nProvider>
            <HelmetProvider>
              <UIConfigProvider>{children}</UIConfigProvider>
            </HelmetProvider>
          </I18nProvider>
        </ConfigProvider>
      </ToastProvider>
    </SWRConfig>
  );
};

const customRender = (ui, options: any = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
