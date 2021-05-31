import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ConfigLoaded } from '../types/Config';
import { ISnippetsParams, IDataGTM } from '../types/GoogleTagManager';
import { sendToGTM, initGTM } from '../utils/GoogleTagManager';
import { useConfig } from './useConfig';

declare global {
  interface Window {
    dataLayer: Object | undefined;
    [key: string]: any;
  }
}

/**
 * The shape of the context provider
 */
type GTMHookProviderProps = { state?: any; children: ReactNode };

/**
 * The initial state
 */
export const initialState: ISnippetsParams = {
  dataLayer: undefined,
  dataLayerName: 'dataLayer',
  environment: undefined,
  id: '',
};

/**
 * The context
 */
const useGTMHookContext = createContext<ISnippetsParams | undefined>(
  initialState,
);

const useGTM = (): ((data: IDataGTM) => void) => {
  const { configLoaded } = useConfig(
    (prev, next) => prev.configLoaded === next.configLoaded,
  );
  const gtmContextState = useContext(useGTMHookContext);

  const sendDataToGTM = useCallback(
    (data: IDataGTM): void => {
      if (configLoaded === ConfigLoaded.Loaded && gtmContextState?.id) {
        sendToGTM({ data, dataLayerName: gtmContextState.dataLayerName! });
      }
    },
    [gtmContextState],
  );

  return sendDataToGTM;
};

export default useGTM;

export const GtmProvider = ({ ...props }: GTMHookProviderProps) => {
  const { configLoaded, cookies } = useConfig((prev, next) => {
    const configEqual = prev.configLoaded === next.configLoaded;
    const cookiesEqual = prev.cookies.cookies === next.cookies.cookies;
    return configEqual && cookiesEqual;
  });
  const [dataLayerState, setDataLayerState] = useState<ISnippetsParams>(
    initialState,
  );

  useEffect(() => {
    if (dataLayerState.id) {
      if (cookies.cookies.analytics) {
        initGTM({
          dataLayer: dataLayerState.dataLayer,
          dataLayerName: dataLayerState.dataLayerName,
          environment: dataLayerState.environment,
          id: dataLayerState.id,
        });
        if (configLoaded === ConfigLoaded.Loaded && dataLayerState?.id) {
          sendToGTM({
            data: {
              event: 'cookiePreferencesChange',
              'tglab.cookies.analytics': cookies.cookies.analytics,
              'tglab.cookies.functional': cookies.cookies.functional,
              'tglab.cookies.marketing': cookies.cookies.marketing,
              'tglab.cookies.personalization': cookies.cookies.personalization,
            },
            dataLayerName: dataLayerState.dataLayerName!,
          });
        }
      } else if (!cookies.cookies.analytics) {
        setDataLayerState(initialState);
      }
    }
  }, [dataLayerState, cookies.cookies.analytics]);
  useEffect(() => {
    if (
      configLoaded === ConfigLoaded.Loaded &&
      window.__config__.gtmId &&
      cookies.cookies.analytics
    ) {
      setDataLayerState(state => ({
        ...state,
        id: window.__config__.gtmId!,
      }));
    }
  }, [configLoaded, cookies.cookies.analytics]);

  return <useGTMHookContext.Provider value={dataLayerState} {...props} />;
};
