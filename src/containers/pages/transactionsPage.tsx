import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { formatUrl } from '../../utils/apiUtils';
import { useI18n } from '../../hooks/useI18n';
import dayjs from 'dayjs';
import clsx from 'clsx';
import 'react-datepicker/dist/react-datepicker.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import QuestionsContainer from '../../components/account-settings/QuestionsContainer';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useApi from '../../hooks/useApi';
import useLocalStorage from '../../hooks/useLocalStorage';

const questionItems = [
  {
    title: 'Additional Information',
    body: 'Expanded description block',
  },
  {
    title: 'Additional Information',
    body: 'Expanded description block',
  },
];

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

const TransactionsTable = ({
  dateTo,
  dateFrom,
  setDateTo,
  setDateFrom,
  data,
  setUrl,
  periodSelected,
  currentDate,
}) => {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const periodInDateFilter = dateTo.diff(dateFrom, 'day');
    const to = periodSelected === periodInDateFilter ? dateTo : currentDate.to;
    const from =
      periodSelected === periodInDateFilter ? dateFrom : currentDate.from;
    setUrl(
      formatUrl('/railsapi/v1/user/transactions.json', {
        to: to.format('DD/MM/YYYY'),
        from: from.format('DD/MM/YYYY'),
        page: currentPage.toString(),
      }),
    );
    setDateTo(to);
    setDateFrom(from);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [periodSelected]);

  return (
    <div className="d-flex flex-column">
      {!data ? (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="brand" className="mx-auto" />
        </div>
      ) : data.transactions.length ? (
        <div className="table-container d-flex flex-column mb-4">
          <Table hover>
            <thead>
              <tr>
                <th>{t('_date')}</th>
                <th>{t('action')}</th>
                <th>{t('account')}</th>
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
                      {transaction.title}
                    </td>
                    <td>
                      <strong className="heading-sm">{t('account')}</strong>
                      {transaction.account_number || '-'}
                    </td>
                    <td>
                      <strong className="heading-sm">{t('amount')}</strong>
                      <span className={clsx(transaction.in && 'text-success')}>
                        {`${transaction.in ? '+' : '-'} ${transaction.amount}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {data.pages > 1 && (
            <Pagination className="ml-auto mr-3 mt-3 mb-n2">
              {[...Array(data.pages)].map((_, i) => {
                return (
                  <Pagination.Item
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    active={i + 1 === currentPage}
                  >
                    {i + 1}
                  </Pagination.Item>
                );
              })}
            </Pagination>
          )}
          <div className="table-container__info">
            {data && data.time_limitation_notice}
          </div>
        </div>
      ) : (
        <h2 className="mt-3 mb-5 text-center">{t('transactions_no_data')}</h2>
      )}
    </div>
  );
};

const TransactionsPeriodFilter = ({
  periodSelected,
  setPeriodSelected,
  setDateFrom,
  setDateTo,
}) => {
  const { t } = useI18n();

  const updatePeriod = period => {
    setPeriodSelected(period);
    setDateFrom(dayjs().subtract(period, 'day'));
    setDateTo(dayjs());
  };

  return (
    <div className="account-tabs mb-sm-3">
      {[7, 14, 30].map(period => {
        return (
          <button
            key={period}
            className={clsx(
              'account-tabs__tab',
              periodSelected === period && 'active',
            )}
            onClick={() => updatePeriod(period)}
          >
            {period} {t('days')}
          </button>
        );
      })}
    </div>
  );
};

const TransactionsDateFilter = ({
  dateTo,
  dateFrom,
  url,
  setDateTo,
  setDateFrom,
  setUrl,
  setPeriodSelected,
}) => {
  const { t } = useI18n();
  const [dateChanged, setDateChanged] = useState(false);
  const validDate = dateTo.diff(dateFrom) >= 0;

  useEffect(() => {
    setDateChanged(false);
  }, [url]);
  const updateDate = () => {
    setUrl(
      formatUrl('/railsapi/v1/user/transactions', {
        to: dateTo.format('DD/MM/YYYY'),
        from: dateFrom.format('DD/MM/YYYY'),
      }),
    );
    setPeriodSelected(dateTo.diff(dateFrom, 'day'));
  };

  return (
    <>
      <div className="date-filter__picker-wrp mb-sm-3">
        <DatePicker
          selected={dateFrom.toDate()}
          onChange={date => {
            setDateChanged(true);
            setDateFrom(dayjs(date as Date));
          }}
          dateFormat="yyyy-MM-dd"
          maxDate={dateTo.toDate()}
        />
        <i className="date-filter__picker-wrp-icon icon-calendar-m"></i>
      </div>
      <span className="text-gray-400 mx-auto mx-sm-1 mb-sm-3">-</span>
      <div className="date-filter__picker-wrp mb-sm-3">
        <DatePicker
          minDate={dateFrom.toDate()}
          selected={dateTo.toDate()}
          onChange={date => {
            setDateChanged(true);
            setDateTo(dayjs(date as Date));
          }}
          dateFormat="yyyy-MM-dd"
          maxDate={dayjs().toDate()}
        />
        <i className="date-filter__picker-wrp-icon icon-calendar-m"></i>
      </div>
      <Button
        className="mt-3 mt-sm-0 ml-sm-2 mr-auto mb-sm-3 btn--small-radius"
        variant="primary"
        disabled={!validDate || !dateChanged}
        onClick={() => {
          setDateChanged(false);
          updateDate();
        }}
      >
        {t('search')}
      </Button>
    </>
  );
};

const TransactionsPage = () => {
  const { t } = useI18n();
  const [url, setUrl] = useState<string | null>(null);
  const { data } = useApi<RailsApiResponse<Transactions>>(url);
  const [periodSelected, setPeriodSelected] = useState(30);
  const [dateTo, setDateTo] = useLocalStorage('transactions-date-to', dayjs(), {
    valueAs: value => dayjs(value),
  });
  const [dateFrom, setDateFrom] = useLocalStorage(
    'transactions-date-from',
    dayjs().subtract(periodSelected, 'day'),
    {
      valueAs: value => dayjs(value),
    },
  );
  const [currentDate, setCurrentDate] = useState({
    from: dateFrom,
    to: dateTo,
  });

  useEffect(() => {
    setUrl(
      formatUrl('/railsapi/v1/user/transactions', {
        to: dateTo.format('DD/MM/YYYY'),
        from: dateFrom.format('DD/MM/YYYY'),
      }),
    );
  }, [periodSelected]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentDate({ from: dateFrom, to: dateTo });
  }, [url]);

  return (
    <main className="container-fluid px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="mb-4">{t('transactions_page_title')}</h1>
      <div className="date-filter mb-4 pb-sm-2">
        <TransactionsDateFilter
          dateTo={dateTo}
          dateFrom={dateFrom}
          url={url}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
          setUrl={setUrl}
          setPeriodSelected={setPeriodSelected}
        />
        <TransactionsPeriodFilter
          periodSelected={periodSelected}
          setPeriodSelected={setPeriodSelected}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
        />
      </div>
      <TransactionsTable
        dateTo={dateTo}
        dateFrom={dateFrom}
        setDateTo={setDateTo}
        setDateFrom={setDateFrom}
        data={data}
        setUrl={setUrl}
        periodSelected={periodSelected}
        currentDate={currentDate}
      />
      <QuestionsContainer items={questionItems} />
    </main>
  );
};

export default TransactionsPage;
