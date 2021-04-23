import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useRoutePath } from '../../hooks/index';
import { REDIRECT_PROTECTED_NOT_LOGGED_IN } from '../../constants';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../../hooks/useAuth';

interface Props extends RouteProps {
  redirectTo?: string;
}

const ProtectedRoute = ({ children, redirectTo, ...props }: Props) => {
  const { user } = useAuth();
  const redirectToPath = useRoutePath(REDIRECT_PROTECTED_NOT_LOGGED_IN);
  if (user.loading) {
    return (
      <div
        style={{ minHeight: '300px' }}
        className="w-100 d-flex align-items-center justify-content-center pt-4 pb-3"
      >
        <Spinner animation="border" variant="black" className="mx-auto" />
      </div>
    );
  }
  if (user.logged_in) {
    return <Route {...props} />;
  }
  return (
    <Redirect
      to={{
        pathname: redirectTo || redirectToPath,
        state: { from: props.location },
      }}
    />
  );
};

export default ProtectedRoute;
