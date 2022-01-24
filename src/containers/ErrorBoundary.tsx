import React from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactElement;
}

const ErrorBoundary = ({ children, fallback }: Props) => (
  <Sentry.ErrorBoundary
    fallback={fallback || <h1>An error has occurred</h1>}
    children={children}
  />
);

export default ErrorBoundary;
