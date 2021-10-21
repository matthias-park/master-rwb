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
  const { cookies } = useConfig((prev, next) => prev.cookies === next.cookies);
  const gtmContextState = useContext(useGTMHookContext);

  const sendDataToGTM = useCallback(
    (data: IDataGTM): void => {
      if (gtmContextState?.id && cookies.analytics) {
        sendToGTM({ data, dataLayerName: gtmContextState.dataLayerName! });
      }
    },
    [gtmContextState, cookies.analytics],
  );

  return sendDataToGTM;
};

export default useGTM;

export const GtmProvider = ({ ...props }: GTMHookProviderProps) => {
  const { cookies, domLoaded } = useConfig(
    (prev, next) =>
      prev.cookies === next.cookies && prev.domLoaded === next.domLoaded,
  );
  const [dataLayerState, setDataLayerState] = useState<ISnippetsParams>(
    initialState,
  );

  useEffect(() => {
    if (dataLayerState.id && domLoaded) {
      initGTM({
        dataLayer: dataLayerState.dataLayer,
        dataLayerName: dataLayerState.dataLayerName,
        environment: dataLayerState.environment,
        id: dataLayerState.id,
      });
      sendToGTM({
        data: {
          event: 'cookiePreferencesChange',
          'tglab.cookies.analytics': cookies.analytics,
          'tglab.cookies.functional': cookies.functional,
          'tglab.cookies.marketing': cookies.marketing,
          'tglab.cookies.personalization': cookies.personalization,
        },
        dataLayerName: dataLayerState.dataLayerName!,
      });
    }
  }, [dataLayerState, domLoaded]);
  useEffect(() => {
    if (window.__config__.gtmId) {
      setDataLayerState(state => ({
        ...state,
        id: window.__config__.gtmId!,
      }));
    }
  }, []);

  return <useGTMHookContext.Provider value={dataLayerState} {...props} />;
};
