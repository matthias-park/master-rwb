import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as Sentry from '@sentry/react';
import { errorHandler, getQueryAffiliates } from '../utils';
import { Config, DevEnv } from '../constants';
import createStoreAsync, { RootState } from '../state';
import StateProvider from './StateProvider';
import { setDomLoaded } from '../state/reducers/config';
import * as uiUtils from '../utils/uiUtils';

if (!DevEnv && Config.sentryDsn) {
  Sentry.init({
    dsn: Config.sentryDsn,
    environment: process.env.TARGET_ENV,
    release: process.env.RELEASE ? `react@${process.env.RELEASE}` : undefined,
    integrations: [],
    tracesSampler: samplingContext => {
      if (samplingContext.transactionContext) {
        return 1;
      }
      return 0;
    },
    beforeBreadcrumb(breadcrumb) {
      if (
        breadcrumb.category === 'console' &&
        (!breadcrumb.level ||
          [
            Sentry.Severity.Info,
            Sentry.Severity.Log,
            Sentry.Severity.Debug,
          ].includes(breadcrumb.level))
      ) {
        return null;
      }
      return breadcrumb;
    },
    beforeSend(event, hint) {
      if (hint?.originalException === 'Timeout') return null;
      const originalException = hint?.originalException?.toString();
      if (originalException?.includes('kambi')) {
        event.level = Sentry.Severity.Warning;
      } else if (
        originalException?.includes('geannuleerd') ||
        originalException?.includes('annulé') ||
        originalException?.includes('anulowane') ||
        originalException?.includes('vazgeçildi')
      )
        return null;
      return event;
    },
  });
  Sentry.setTag('cookiesEnabled', window.navigator.cookieEnabled || 'n/a');
  Sentry.setTag('franchise', Config.name || 'n/a');
}
if (DevEnv) {
  import('url').then(url => {
    const connection = new WebSocket(
      url.format({
        protocol: 'ws',
        hostname: window.location.hostname,
        port: window.location.port,
        pathname: '/sockjs-node',
        slashes: true,
      }),
    );
    connection.addEventListener('message', ev => {
      const data = JSON.parse(ev.data);
      if (data.type === 'styleChange') {
        const brand = data.data?.replace(/\\/g, '/').split('/')?.[1];
        if (brand) {
          (document.getElementById(
            'devStyles',
          ) as HTMLLinkElement).href = `/static/css/theme-${brand}.css?reload=${new Date().getTime()}`;
        }
      }
    });
  });
}
window.addEventListener('error', errorHandler);
const MOUNT_NODE = document.getElementById('root') as HTMLElement;
getQueryAffiliates();

const indexApp = getChildren => {
  createStoreAsync().then(store => {
    window.addEventListener('load', () => {
      store.dispatch(setDomLoaded());
      if (
        Config.zendesk &&
        !(store.getState() as RootState).config.mobileView
      ) {
        import('../utils/uiUtils')
          .then(({ injectZendeskScript }) => {
            injectZendeskScript();
          })
          .catch(e => {
            Sentry.captureMessage(e);
          });
      }
      if (Config.wagerGames) {
        uiUtils.injectWagerGamesScript();
      }
      if (Config.fullStory) {
        uiUtils.injectFullstoryScript();
      }
      if (Config.leverageMedia) {
        uiUtils.injectLeverageMediaScript();
      }
    });
    const children = getChildren(store);
    ReactDOM.render(
      <React.StrictMode>
        <StateProvider store={store}>
          <App children={children} />
        </StateProvider>
      </React.StrictMode>,
      MOUNT_NODE,
    );
  });
};
export default indexApp;
