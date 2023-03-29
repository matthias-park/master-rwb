import React, { useState, useEffect } from 'react';
import { formatUrl } from '../../../utils/apiUtils';
import { useI18n } from '../../../hooks/useI18n';
import { useAuth } from '../../../hooks/useAuth';
import dayjs, { Dayjs } from 'dayjs';
import clsx from 'clsx';
import 'react-datepicker/dist/react-datepicker.css';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import useLocalStorage from '../../../hooks/useLocalStorage';
import BalancesContainer from '../components/account-settings/BalancesContainer';
import TablePagination from '../components/account-settings/TablePagination';
import { Franchise } from '../../../constants';
import NumberFormat from 'react-number-format';
import DateFilter from '../components/account-settings/DateFilter';

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

const questionItems = [
  {
    title: 'transactions_question_1',
    body: 'transactions_answer_1',
  },
  {
    title: 'transactions_question_2',
    body: 'transactions_answer_2',
  },
];

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
      <QuestionsContainer items={questionItems} />
      <HelpBlock
        title={'user_help_title'}
        blocks={['faq', 'phone', 'email']}
        className="d-block d-xl-none"
      />
    </main>
  );
};

export default TransactionsPage;
