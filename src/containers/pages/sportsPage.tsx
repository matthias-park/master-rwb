import React, { useEffect, useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { formatUrl, getApi } from '../../utils/apiUtils';
import GetToken from '../../types/api/kambi/GetToken';

interface Params {
  locale: string;
  playerId: number | string;
  ticket: string;
}

const SportsPage = () => {
  const config = useConfig();
  const [params, setParams] = useState<Params | null>(null);
  useEffect(() => {
    (async () => {
      const playerId = config.user.id ? config.user.id : '';
      const data: GetToken | null = playerId
        ? await getApi<GetToken>('/railsapi/v1/kambi/get_token')
        : null;
      const ticket = data?.Data || '';
      setParams({
        locale: config.locale,
        playerId,
        ticket,
      });
    })();
  }, [config]);
  if (!params || config.user.loading) {
    return null;
  }
  return (
    <iframe
      title="iframe"
      style={{ width: '100vw', height: '100vh' }}
      scrolling="no"
      frameBorder="0"
      id="tonysportsbookiframe"
      name="tonysportsbookiframe"
      src={formatUrl('/iframe/kambiSB.html', params as any)}
    />
  );
};

export default SportsPage;
