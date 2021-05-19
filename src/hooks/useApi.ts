import { useContext } from 'react';
import useSWR, { ConfigInterface } from 'swr';
import { AuthContext } from './useAuth';

export const useApi: typeof useSWR = (key, ...options: any[]) => {
  const userContext = useContext(AuthContext);
  const fn = typeof options?.[0] === 'function' ? options[0] : undefined;
  const config: ConfigInterface<any, any, any> =
    typeof options?.[0] === 'object' ? options[0] : options?.[1];
  const newConfig = { ...config };
  const swrOptions: any[] = [];
  if (fn) {
    swrOptions.push(fn);
  }
  newConfig.initialData =
    config?.initialData || window.PRERENDER_CACHE?.[key || ''];
  newConfig.revalidateOnMount = window.PRERENDER_CACHE?.[key || '']
    ? false
    : config?.revalidateOnMount;
  newConfig.onSuccess = (...props) => {
    if (window.PRERENDER_CACHE) window.PRERENDER_CACHE[key || ''] = props[0];
    if (config?.onSuccess) config.onSuccess(...props);
  };
  newConfig.onError = (...props) => {
    if (config?.onError) config.onError(...props);
    if (props?.[0]?.Code === 401 && userContext) userContext.updateUser();
  };
  swrOptions.push(newConfig);
  return useSWR(key, ...swrOptions);
};

export default useApi;
