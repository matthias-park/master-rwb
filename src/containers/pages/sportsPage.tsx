import React, { useEffect, useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { getApi } from '../../utils/apiUtils';
import Config from '../../types/Config';
import { useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import Spinner from 'react-bootstrap/Spinner';
import { useUIConfig } from '../../hooks/useUIConfig';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import KambiSportsbook, {
  KambiSportsbookProps,
} from '../../components/KambiSportsbook';

const getSBParams = async (config: Config, error: () => void) => {
  const playerId = config.user.id ? config.user.id.toString() : '';
  const data = playerId
    ? await getApi<RailsApiResponse<string>>(
        '/railsapi/v1/kambi/get_token',
      ).catch((res: RailsApiResponse<null>) => {
        if (res.Fallback) {
          error();
        }
        return res;
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
  const { contentStyle } = useUIConfig();
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
        console.log(sbParams);
        setParams(sbParams);
      });
    }
  }, [config.user.id, config.user.loading, config.locale]);

  return (
    <div
      style={{ ...contentStyle.styles, minHeight: 100 }}
      className="position-relative"
    >
      <div className="position-absolute w-100 d-flex justify-content-center pt-4 pb-3">
        <Spinner animation="border" variant="black" className="mx-auto" />
      </div>
      {!!params && (
        <KambiSportsbook updateBalance={updateUserBalance} {...params} />
      )}
    </div>
  );
};

export default SportsPage;
