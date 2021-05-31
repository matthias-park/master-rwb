import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  const gtmContextState = useContext(useGTMHookContext);

  const sendDataToGTM = useCallback(
    (data: IDataGTM): void => {
      if (gtmContextState?.id) {
        sendToGTM({ data, dataLayerName: gtmContextState.dataLayerName! });
      }
    },
    [gtmContextState],
  );

  return sendDataToGTM;
};

export default useGTM;

export const GtmProvider = ({ ...props }: GTMHookProviderProps) => {
  const { cookies } = useConfig(
    (prev, next) => prev.cookies.cookies === next.cookies.cookies,
  );
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
        if (dataLayerState?.id) {
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
    if (window.__config__.gtmId && cookies.cookies.analytics) {
      setDataLayerState(state => ({
        ...state,
        id: window.__config__.gtmId!,
      }));
    }
  }, [cookies.cookies.analytics]);

  return <useGTMHookContext.Provider value={dataLayerState} {...props} />;
};
