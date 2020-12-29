import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './containers/App';
import { HelmetProvider } from 'react-helmet-async';
import { ConfigProvider } from './hooks/useConfig';
import { I18nProvider } from './hooks/useI18n';
import { BgBackdropProvider } from './hooks/useBgBackdrop';
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <ConfigProvider>
    <I18nProvider>
      <HelmetProvider>
        <BgBackdropProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </BgBackdropProvider>
      </HelmetProvider>
    </I18nProvider>
  </ConfigProvider>,
  MOUNT_NODE,
);
