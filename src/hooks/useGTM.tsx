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
  dataLayerName: 'tglabDataLayer',
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
      console.log(data);
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
  const { configLoaded } = useConfig(
    (prev, next) => prev.configLoaded === next.configLoaded,
  );
  const [dataLayerState, setDataLayerState] = useState<ISnippetsParams>(
    initialState,
  );

  useEffect(() => {
    if (dataLayerState.id !== '') {
      initGTM({
        dataLayer: dataLayerState.dataLayer,
        dataLayerName: dataLayerState.dataLayerName,
        environment: dataLayerState.environment,
        id: dataLayerState.id,
      });
    }
  }, [dataLayerState]);
  useEffect(() => {
    if (configLoaded && window.__config__.gtmId) {
      setDataLayerState(state => ({
        ...state,
        id: window.__config__.gtmId!,
      }));
    }
  }, [configLoaded]);

  return <useGTMHookContext.Provider value={dataLayerState} {...props} />;
};
