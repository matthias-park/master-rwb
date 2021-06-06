import 'core-js';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './containers/App';
import * as Sentry from '@sentry/react';
import { errorHandler } from './utils';
// import { Workbox } from 'workbox-window';
// import Lockr from 'lockr';

if (process.env.TARGET_ENV !== 'development' && window.__config__.sentryDsn) {
  Sentry.init({
    dsn: window.__config__.sentryDsn,
    environment: process.env.TARGET_ENV,
  });
}
const MOUNT_NODE = document.getElementById('root') as HTMLElement;
window.addEventListener('error', errorHandler);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  MOUNT_NODE,
);

// if (
//   Lockr.get('service-worker') &&
//   process.env.TARGET_ENV !== 'development' &&
//   'serviceWorker' in navigator
// ) {
//   const wb = new Workbox(`/service-worker.js?name=${window.__config__.name}`);

//   wb.addEventListener('installed', event => {
//     if (event.isUpdate) {
//       window._wbUpdate = true;
//       window.toast?.('Website update available', {
//         appearance: 'success',
//         autoDismiss: false,
//         onDismiss: () => window.location.reload(),
//       });
//     }
//   });

//   setInterval(() => {
//     wb.update();
//   }, 3600000); // 1hour

//   wb.register();
// } else {
//   window.navigator.serviceWorker
//     ?.getRegistrations()
//     ?.then(function (registrations) {
//       if (registrations.length) {
//         for (let registration of registrations) {
//           registration.unregister();
//         }
//         window.location.reload();
//       }
//     });
// }
