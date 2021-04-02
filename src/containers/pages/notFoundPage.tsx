import * as React from 'react';
import { useUIConfig } from '../../hooks/useUIConfig';
import clsx from 'clsx';

const NotFoundPage = () => {
  const { headerNav } = useUIConfig();

  return (
    <main
      className={clsx(
        'container-fluid my-5 pb-5',
        headerNav.active && 'pt-xl-4',
      )}
    >
      <p>Page not found.</p>
    </main>
  );
};

export default NotFoundPage;
