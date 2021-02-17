import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useUIConfig } from '../../hooks/useUIConfig';

const NotFoundPage = () => {
  const { contentStyle } = useUIConfig();
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <main style={contentStyle.styles} className="container-fluid mb-4">
        <p>Page not found.</p>
      </main>
    </>
  );
};

export default NotFoundPage;
