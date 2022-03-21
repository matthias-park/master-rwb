import React, { useEffect } from 'react';
import useApi from '../../../../hooks/useApi';
import { useI18n } from '../../../../hooks/useI18n';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../../../../hooks/useAuth';
import NumberFormat from 'react-number-format';

const BalancesContainer = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data, error, mutate } = useApi<any>('/restapi/v1/user/balances');
  const isDataLoading = !data && !error;

  useEffect(() => {
    mutate();
  }, [user.balance]);

  return (
    <div className="outer-info-block balances-container">
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      )}
      <ul className="balances-list">
        {!!data?.Data &&
          Object.entries(data.Data).map(([key, value]) => (
            <li className="balances-list__item">
              <div className="balances-list__content">
                <span className="balances-list__content-title">{t(key)}</span>
                <span className="balances-list__content-value">
                  <NumberFormat
                    value={Number(value)}
                    thousandSeparator
                    displayType={'text'}
                    prefix={user.currency}
                  />
                </span>
              </div>
              <i
                className={`icon-${window.__config__.name}-${key} balances-list__icon`}
              ></i>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BalancesContainer;
