import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';

interface Props extends RouteProps {
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = '/login',
  ...props
}: Props) => {
  const { user } = useConfig();
  if (user.loading) return null;
  if (user.logged_in) {
    return <Route {...props} />;
  }
  return (
    <Redirect
      to={{
        pathname: redirectTo,
        state: { from: props.location },
      }}
    />
  );
};

export default ProtectedRoute;
