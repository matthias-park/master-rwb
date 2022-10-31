import React from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactElement;
  setGotError?: (errorActive: boolean) => void;
}

const ErrorBoundary = ({ children, fallback, setGotError }: Props) => (
  <Sentry.ErrorBoundary
    fallback={fallback || <h1>An error has occurred</h1>}
    onError={() => setGotError?.(true)}
    onMount={() => setGotError?.(false)}
    children={children}
  />
);

export default ErrorBoundary;
