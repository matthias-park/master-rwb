import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { useAuth } from '../../../hooks/useAuth';
import dayjs, { Dayjs } from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';
import Spinner from 'react-bootstrap/Spinner';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useLocalStorage from '../../../hooks/useLocalStorage';
import BalancesContainer from '../components/account-settings/BalancesContainer';
import NumberFormat from 'react-number-format';
import DateFilter from '../components/account-settings/DateFilter';
import { postApi } from '../../../utils/apiUtils';
import { camelToSnakeCase } from '../../../utils/reactUtils';

interface TransactionsSummary {
  InitialBalance: number;
  EndingBalance: number;
  Bets: number;
  TotalDeposits: number;
  TotalWithdrawals: number;
  WinLossAmount: number;
  Winnings: number;
  Code: number;
  Message: string;
}

const TransactionsSummaryPage = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [dateTo, setDateTo] = useLocalStorage('transactions-date-to', dayjs(), {
    valueAs: value => dayjs(value),
  });
  const [dateFrom, setDateFrom] = useLocalStorage(
    'transactions-date-from',
    dayjs().subtract(30, 'day'),
    {
      valueAs: value => dayjs(value),
    },
  );
  const [data, setData] = useState<TransactionsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(!data);

  useEffect(() => {
    updateUrl(dateFrom, dateTo);
  }, []);

  const updateUrl = async (from?: Dayjs, to?: Dayjs) => {
    setIsLoading(true);
    const resp = await postApi<RailsApiResponse<TransactionsSummary>>(
      '/restapi/v1/user/transaction_summary',
      {
        date_to: (to || dateTo).format('MM/DD/YYYY') + ' 23:59:59',
        date_from: (from || dateFrom).format('MM/DD/YYYY') + ' 00:00:00',
      },
    );
    if (resp.Success && resp?.Data) {
      setData(resp?.Data);
    }
    if (from && dateFrom !== from) setDateFrom(from);
    if (to && dateTo !== to) setDateTo(to);
    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  return (
    <main className="container-fluid px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <BalancesContainer />
      <h1 className="account-settings__title mb-4">
        {t('transactions_summary_page_title')}
      </h1>
      <div className="outer-info-block p-4 mb-4">
        <DateFilter
          dateTo={dateTo}
          dateFrom={dateFrom}
          updateUrl={updateUrl}
          className="pt-2"
          withPeriods
        />
        {isLoading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner
              variant="secondary"
              animation="border"
              className="spinner-custom mx-auto"
            />
          </div>
        )}
        {!isLoading && (
          <ul className="balances-list balances-list--cards">
            {!!data &&
              Object.entries(data)
                .filter(([key, value]) => !['Code', 'Message'].includes(key))
                .map(([key, value]) => (
                  <li className="balances-list__item">
                    <div className="balances-list__content">
                      <span className="balances-list__content-title">
                        {t(
                          `${camelToSnakeCase(
                            key.toString().charAt(0).toLowerCase() +
                              key.toString().slice(1),
                          )}`,
                        )}
                      </span>
                      <span className="balances-list__content-value">
                        <NumberFormat
                          value={Number(value)}
                          thousandSeparator
                          displayType={'text'}
                          prefix={user.currency}
                          decimalScale={2}
                          fixedDecimalScale={true}
                        />
                      </span>
                    </div>
                    <i
                      className={`icon-${window.__config__.name}-${key} balances-list__icon`}
                    ></i>
                  </li>
                ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default TransactionsSummaryPage;
