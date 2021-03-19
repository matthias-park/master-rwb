import React from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ErrorBoundary = ({ children, fallback }: Props) => (
  <Sentry.ErrorBoundary
    fallback={fallback || <h1>An error has occurred</h1>}
    onError={error => {
      if (error.name === 'ChunkLoadError') {
        window.location.reload();
      }
    }}
    children={children}
  />
);

export default ErrorBoundary;
