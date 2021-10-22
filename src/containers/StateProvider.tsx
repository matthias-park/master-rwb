import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '../state';
import { checkLocale, fetchConstants } from '../state/reducers/config';

interface Props {
  children: React.ReactNode;
}
const StateProvider = ({ children }: Props) => {
  useEffect(() => {
    store.dispatch(fetchConstants());
    window.addEventListener('popstate', () => store.dispatch(checkLocale()));
  }, []);
  return <Provider store={store}>{children}</Provider>;
};

export default StateProvider;
