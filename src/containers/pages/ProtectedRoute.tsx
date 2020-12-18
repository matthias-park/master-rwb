import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';

interface Props extends RouteProps {
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = '/login',
  ...rest
}: Props) => {
  const config = useConfig();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        config.user && config.user.id ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
