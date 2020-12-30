import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './containers/App';
import { HelmetProvider } from 'react-helmet-async';
import { ConfigProvider } from './hooks/useConfig';
import { I18nProvider } from './hooks/useI18n';
import { SWRConfig } from 'swr';
import { SwrFetcherConfig } from './utils/apiUtils';
import { UIConfigProvider } from 'hooks/useUIConfig';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <SWRConfig value={SwrFetcherConfig}>
    <ConfigProvider>
      <I18nProvider>
        <HelmetProvider>
          <UIConfigProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </UIConfigProvider>
        </HelmetProvider>
      </I18nProvider>
    </ConfigProvider>
  </SWRConfig>,
  MOUNT_NODE,
);
