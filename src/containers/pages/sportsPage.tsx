import React, { useEffect, useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { getApi } from '../../utils/apiUtils';
import GetToken from '../../types/api/kambi/GetToken';
import Config from '../../types/Config';
import { useCallback } from 'react';
import KambiSportsbook, {
  KambiSportsbookProps,
} from '../../components/KambiSportsbook';

const getSBParams = async (config: Config) => {
  const playerId = config.user.id ? config.user.id.toString() : '';
  const data: GetToken | null = playerId
    ? await getApi<GetToken>('/railsapi/v1/kambi/get_token')
    : null;
  return {
    key: Math.floor(Math.random() * (500 - 100) + 100),
    locale: config.locale,
    playerId,
    ticket: data?.Data || '',
    currency: 'EUR',
    market: 'BE',
    getApiBalance: `${window.API_URL}/players/get_balance/true`,
  };
};

const SportsPage = () => {
  const config = useConfig();
  const [params, setParams] = useState<KambiSportsbookProps | null>(null);

  const updateUserBalance = useCallback(() => config.mutateUser(), []);

  useEffect(() => {
    if (!config.user.loading) {
      getSBParams(config).then(async sbParams => {
        setParams(sbParams);
      });
    }
  }, [config.user.id, config.locale]);

  if (!params) return null;
  return <KambiSportsbook updateBalance={updateUserBalance} {...params} />;
};

export default SportsPage;
