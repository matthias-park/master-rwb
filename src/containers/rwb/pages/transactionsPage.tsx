import React, { useState, useEffect } from 'react';
import { formatUrl } from '../../../utils/apiUtils';
import { useI18n } from '../../../hooks/useI18n';
import { useAuth } from '../../../hooks/useAuth';
import dayjs, { Dayjs } from 'dayjs';
import clsx from 'clsx';
import 'react-datepicker/dist/react-datepicker.css';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import useLocalStorage from '../../../hooks/useLocalStorage';
import BalancesContainer from '../components/account-settings/BalancesContainer';
import TablePagination from '../components/account-settings/TablePagination';
import { Franchise } from '../../../constants';
import NumberFormat from 'react-number-format';
import DateFilter from '../components/account-settings/DateFilter';
import { getApi } from '../../../utils/apiUtils';

interface Transactions {
  pages: number;
  time_limitation_notice: string;
  title: string;
  transactions: {
    in: boolean;
    date: string;
    title: string;
    amount: string;
    account_number: string;
  }[];
}

const TransactionOverviewTable = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data, error } = useApi('/restapi/v1/user/session_details', url =>
    getApi<RailsApiResponse<any>>(url).then(data => {
      return Object.entries(data.Data)
        .filter(([key]) => !['Code', 'Message'].includes(key))
        .map(item => {
          const [key, value] = item;
          const keyInSnakeCase = key.replace(
            /[A-Z]/g,
            letter => `_${letter.toLowerCase()}`,
          );
          return {
            translation: `transactions_overview${keyInSnakeCase}`,
            value: value,
          };
        });
    }),
  );
  const isDataLoading = !data && !error;
  return (
    <div className="table-container mb-3">
      {isDataLoading ? (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      ) : (
        <Table className="overview-table">
          <thead>
            <th colSpan={data?.length} className="text-light">
              {t('transactions_overview_title')}
            </th>
          </thead>
          <tbody>
            <tr>
              {data?.map((column, i) => {
                return (
                  <td key={i}>
                    <p className="overview-table__heading">
                      {t(column.translation)}
                    </p>
                    <NumberFormat
                      value={Number(column.value)}
                      prefix={user.currency}
                      thousandSeparator
                      displayType={'text'}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      renderText={value => (
                        <div className="d-inline d-sm-block font-weight-bold mt-3">
                          {value}
                        </div>
                      )}
                    />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
};

const TransactionsTable = ({ dateTo, dateFrom, data, updateUrl }) => {
  const { user } = useAuth();
  const { t, jsxT } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    updateUrl(dateFrom, dateTo, currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [dateTo.format('YYYY-MM-DD'), dateFrom.format('YYYY-MM-DD')]);

  return (
    <div className="d-flex flex-column">
      {!data ? (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      ) : data.transactions?.length ? (
        <div className="table-container d-flex flex-column mb-4">
          <Table hover>
            <thead>
              <tr>
                <th>{t('_date')}</th>
                <th>{t('action')}</th>
                {!Franchise.gnogaz && <th>{t('account')}</th>}
                <th>{t('amount')}</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((transaction, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <strong className="heading-sm">{t('_date')}</strong>
                      {dayjs(new Date(transaction.date)).format('YYYY-MM-DD')}
                    </td>
                    <td>
                      <strong className="heading-sm">{t('action')}</strong>
                      {t(transaction.title)}
                    </td>
                    {!Franchise.gnogaz && (
                      <td>
                        <strong className="heading-sm">{t('account')}</strong>
                        {transaction.account_number || '-'}
                      </td>
                    )}
                    <td>
                      <strong className="heading-sm">{t('amount')}</strong>
                      <span className={clsx(transaction.in && 'text-success')}>
                        <NumberFormat
                          value={transaction.amount}
                          thousandSeparator
                          displayType={'text'}
                          prefix={`${transaction.in ? '+' : '-'} ${
                            user.currency
                          }`}
                          decimalScale={2}
                          fixedDecimalScale={true}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <TablePagination
            data={data}
            totalPages={data.pages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          {window.__config__.name === 'strive' && (
            <div className="table-container__info">
              {data && jsxT(data.time_limitation_notice)}
            </div>
          )}
        </div>
      ) : (
        <h2 className="mt-3 mb-5 text-center">{t('transactions_no_data')}</h2>
      )}
    </div>
  );
};

const TransactionsPage = () => {
  const { t } = useI18n();
  const [url, setUrl] = useState<string | null>(null);
  const { data } = useApi<RailsApiResponse<Transactions>>(url);
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

  const updateUrl = (from?: Dayjs, to?: Dayjs, page?: string) => {
    if (from && dateFrom !== from) setDateFrom(from);
    if (to && dateTo !== to) setDateTo(to);

    const newUrl = formatUrl('/restapi/v1/user/transactions', {
      from: (from || dateFrom).format('DD/MM/YYYY'),
      to: (to || dateTo).format('DD/MM/YYYY'),
      page: page || 1,
    });
    if (url !== newUrl) {
      setUrl(newUrl);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [url]);

  return (
    <main className="container-fluid px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <BalancesContainer />
      <h1 className="account-settings__title mb-4">
        {t('transactions_page_title')}
      </h1>
      <TransactionOverviewTable />
      <div
        className={clsx(
          Franchise.desertDiamond || Franchise.gnogaz || Franchise.gnogon
            ? 'outer-info-block p-4 mb-4'
            : 'd-contents',
        )}
      >
        <DateFilter
          dateTo={dateTo}
          dateFrom={dateFrom}
          updateUrl={updateUrl}
          className="pt-2"
          withPeriods
        />
        <TransactionsTable
          dateTo={dateTo}
          dateFrom={dateFrom}
          updateUrl={updateUrl}
          data={data}
        />
      </div>
    </main>
  );
};

export default TransactionsPage;
