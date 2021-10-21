import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { checkLocale, fetchConstants } from '../state/reducers/config';

interface Props {
  children: React.ReactNode;
  store: Store<any, any>;
}
const StateProvider = ({ children, store }: Props) => {
  useEffect(() => {
    store.dispatch(fetchConstants());
    window.addEventListener('popstate', () => store.dispatch(checkLocale()));
  }, []);
  return <Provider store={store}>{children}</Provider>;
};

export default StateProvider;
