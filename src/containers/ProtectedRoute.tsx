import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';

const ProtectedRoute = ({ children, ...rest }: RouteProps) => {
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
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
