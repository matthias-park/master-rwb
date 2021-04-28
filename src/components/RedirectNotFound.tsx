import React from 'react';
import { Redirect } from 'react-router';
import { PagesName } from '../constants';
import { useRoutePath } from '../hooks';

const RedirectNotFound = () => {
  const notFoundRoute = useRoutePath(PagesName.NotFoundPage, true);
  return <Redirect to={notFoundRoute} />;
};

export default RedirectNotFound;
