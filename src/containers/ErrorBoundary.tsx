import React from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: React.ReactNode;
}

const ErrorBoundary = ({ children }: Props) => {
  return (
    <Sentry.ErrorBoundary
      fallback={'An error has occurred'}
      children={children}
    />
  );
};

export default ErrorBoundary;
