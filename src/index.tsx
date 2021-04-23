import * as React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as ReactDOM from 'react-dom';
import App from './containers/App';
import { HelmetProvider } from 'react-helmet-async';
import { ConfigProvider } from './hooks/useConfig';
import { I18nProvider } from './hooks/useI18n';
import { SWRConfig } from 'swr';
import { SwrFetcherConfig } from './utils/apiUtils';
import { ToastProvider } from 'react-toast-notifications';
import { GtmProvider } from './hooks/useGTM';
import * as Sentry from '@sentry/react';
import { Workbox } from 'workbox-window';
import Lockr from 'lockr';
import { AuthProvider } from './hooks/useAuth';

if (process.env.TARGET_ENV !== 'development' && window.__config__.sentryDsn) {
  Sentry.init({
    dsn: window.__config__.sentryDsn,
    environment: process.env.TARGET_ENV,
  });
}
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <SWRConfig value={SwrFetcherConfig}>
    <ToastProvider>
      <ConfigProvider>
        <I18nProvider>
          <GtmProvider>
            <AuthProvider>
              <HelmetProvider>
                <React.StrictMode>
                  <App />
                </React.StrictMode>
              </HelmetProvider>
            </AuthProvider>
          </GtmProvider>
        </I18nProvider>
      </ConfigProvider>
    </ToastProvider>
  </SWRConfig>,
  MOUNT_NODE,
);

if (
  Lockr.get('service-worker') &&
  process.env.TARGET_ENV !== 'development' &&
  'serviceWorker' in navigator
) {
  const wb = new Workbox(`/service-worker.js?name=${window.__config__.name}`);

  wb.addEventListener('installed', event => {
    if (event.isUpdate) {
      window._wbUpdate = true;
      window.toast?.('Website update available', {
        appearance: 'success',
        autoDismiss: false,
        onDismiss: () => window.location.reload(),
      });
    }
  });

  setInterval(() => {
    wb.update();
  }, 3600000); // 1hour

  wb.register();
} else {
  window.navigator.serviceWorker
    ?.getRegistrations()
    ?.then(function (registrations) {
      if (registrations.length) {
        for (let registration of registrations) {
          registration.unregister();
        }
        window.location.reload();
      }
    });
}
