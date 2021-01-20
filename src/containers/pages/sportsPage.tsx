import React, { useEffect, useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { getApi } from '../../utils/apiUtils';
import GetToken from '../../types/api/kambi/GetToken';
import Config from '../../types/Config';
import { useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import KambiSportsbook, {
  KambiSportsbookProps,
} from '../../components/KambiSportsbook';

const getSBParams = async (config: Config, error: () => void) => {
  const playerId = config.user.id ? config.user.id.toString() : '';
  const data: GetToken | null = playerId
    ? await getApi<GetToken>('/railsapi/v1/kambi/get_token').catch(err => {
        error();
        console.log(err);
        return null;
      })
    : null;
  return {
    locale: config.locale,
    playerId,
    ticket: data?.Data || '',
    currency: 'EUR',
    market: 'BE',
    getApiBalance: `${window.API_URL}/players/get_balance/true`,
  };
};

const SportsPage = () => {
  const { addToast } = useToasts();
  const config = useConfig();
  const [params, setParams] = useState<KambiSportsbookProps | null>(null);
  const handleTokenError = () =>
    addToast(`Failed to get user token`, {
      appearance: 'error',
      autoDismiss: true,
    });
  const updateUserBalance = useCallback(() => config.mutateUser(), []);

  useEffect(() => {
    if (!config.user.loading) {
      getSBParams(config, handleTokenError).then(async sbParams => {
        setParams(sbParams);
      });
    }
  }, [config.user.id, config.user.loading, config.locale]);

  if (!params) return null;
  return <KambiSportsbook updateBalance={updateUserBalance} {...params} />;
};

export default SportsPage;
