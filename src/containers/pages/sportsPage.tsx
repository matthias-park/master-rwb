import React from 'react';
import { useConfig } from '../../hooks/useConfig';
import { formatUrl } from '../../utils/apiUtils';

const SportsPage = () => {
  const config = useConfig();
  const params = {
    locale: 'en',
    playerId: config.user.id ? config.user.id : '',
    ticket: '',
  };
  return (
    <iframe
      title="iframe"
      style={{ width: '100vw', height: '100vh' }}
      scrolling="no"
      frameBorder="0"
      id="tonysportsbookiframe"
      name="tonysportsbookiframe"
      src={formatUrl('/iframe/kambiSB.html', params)}
    />
  );
};

export default SportsPage;
