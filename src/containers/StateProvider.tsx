import React from 'react';
import { Provider } from 'react-redux';
import store from '../state';

interface Props {
  children: React.ReactNode;
}
const StateProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StateProvider;
