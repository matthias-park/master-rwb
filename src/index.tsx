import 'core-js';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './containers/App';
import * as Sentry from '@sentry/react';
import { errorHandler } from './utils';
import { DevEnv } from './constants';

if (!DevEnv && window.__config__.sentryDsn) {
  Sentry.init({
    dsn: window.__config__.sentryDsn,
    environment: process.env.TARGET_ENV,
    beforeSend(event, hint) {
      if (hint?.originalException === 'Timeout') return null;
      const originalException = hint?.originalException?.toString();
      if (originalException?.includes('kambi')) {
        if (
          originalException.includes('ChunkLoadError') ||
          originalException.includes('geannuleerd') ||
          originalException.includes('annulé') ||
          originalException.includes('anulowane')
        )
          return null;
        if (event.level === Sentry.Severity.Error)
          event.level = Sentry.Severity.Warning;
      }
      return event;
    },
  });
  Sentry.setTag('cookiesEnabled', window.navigator.cookieEnabled || 'n/a');
}
window.addEventListener('error', errorHandler);
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  MOUNT_NODE,
);
