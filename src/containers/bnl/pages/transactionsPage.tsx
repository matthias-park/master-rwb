import React, { useState, useEffect, useMemo, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { formatUrl } from '../../../utils/apiUtils';
import { useI18n } from '../../../hooks/useI18n';
import dayjs, { Dayjs } from 'dayjs';
import clsx from 'clsx';
import 'react-datepicker/dist/react-datepicker.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { checkHrOverflow } from '../../../utils/uiUtils';

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
  const { t, jsxT } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationOverflow, setPaginationOverflow] = useState(false);

  useEffect(() => {
    updateUrl(dateFrom, dateTo, currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [dateTo.format('YYYY-MM-DD'), dateFrom.format('YYYY-MM-DD')]);

  useEffect(() => {
    setPaginationOverflow(checkHrOverflow('.table-container', '.pagination'));
  }, [data]);

  return (
    <div className="d-flex flex-column">
      {!data ? (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="brand" className="mx-auto" />
        </div>
      ) : data.transactions?.length ? (
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
                      {t(transaction.title)}
                    </td>
                    <td>
                      <strong className="heading-sm">{t('account')}</strong>
                      {transaction.account_number
                        ?.match(/.{1,4}/g)
                        ?.join(' ') || '-'}
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
            <Pagination className="mt-3 mb-n2 mx-auto mr-md-3 ml-md-auto">
              {!paginationOverflow ? (
                [...Array(data.pages)].map((_, i) => {
                  return (
                    <Pagination.Item
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      active={i + 1 === currentPage}
                    >
                      {i + 1}
                    </Pagination.Item>
                  );
                })
              ) : (
                <>
                  {currentPage > 2 && (
                    <>
                      <Pagination.Item onClick={() => setCurrentPage(1)}>
                        1
                      </Pagination.Item>
                      {currentPage !== 3 && <Pagination.Ellipsis />}
                    </>
                  )}
                  {[...Array(data.pages)].map(
                    (_, i) =>
                      i >= currentPage - 2 &&
                      i < currentPage + 1 && (
                        <Pagination.Item
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          active={i + 1 === currentPage}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ),
                  )}
                  {currentPage < data.pages - 1 && (
                    <>
                      {currentPage !== data.pages - 2 && (
                        <Pagination.Ellipsis />
                      )}
                      <Pagination.Item
                        onClick={() => setCurrentPage(data.pages)}
                      >
                        {data.pages}
                      </Pagination.Item>
                    </>
                  )}
                </>
              )}
            </Pagination>
          )}
          <div className="table-container__info">
            {data && jsxT(data.time_limitation_notice)}
          </div>
        </div>
      ) : (
        <h2 className="mt-3 mb-5 text-center">{t('transactions_no_data')}</h2>
      )}
    </div>
  );
};

const periods = [7, 14, 30];
const TransactionsPeriodFilter = ({ dateFrom, dateTo, updateUrl }) => {
  const { t } = useI18n();
  const dateToToday = useMemo(() => dayjs().isSame(dateTo, 'day'), [dateTo]);
  const dateFromPeriod = useMemo(
    () =>
      periods.find(period =>
        dayjs().subtract(period, 'day').isSame(dateFrom, 'day'),
      ),
    [dateFrom],
  );

  const updatePeriod = period =>
    updateUrl(dayjs().subtract(period, 'day'), dayjs());
  return (
    <div className="account-tabs mb-sm-3">
      {periods.map(period => {
        return (
          <button
            key={period}
            className={clsx(
              'account-tabs__tab',
              dateFromPeriod === period && !!dateToToday && 'active',
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

const DatepickerInput = ({ ...props }) => (
  <div className="date-filter__picker-wrp-input" {...props}>
    {props.value}
  </div>
);

const TransactionsDateFilter = ({ dateTo, dateFrom, updateUrl }) => {
  const { t } = useI18n();
  const [newDateFrom, setNewDateFrom] = useState<Dayjs>(dateFrom);
  const [newDateTo, setNewDateTo] = useState<Dayjs>(dateTo);
  const [isOpen, setIsOpen] = useState<string>('');
  const validDate = newDateTo.diff(newDateFrom, 'd') >= 0;

  useEffect(() => {
    setNewDateFrom(dateFrom);
    setNewDateTo(dateTo);
  }, [dateFrom.format('DD/MM/YYYY'), dateTo.format('DD/MM/YYYY')]);

  const disabledSearchBtn = useMemo(() => {
    const formatDate = date => date.format('DD/MM/YYYY');
    return (
      !validDate ||
      (formatDate(dateFrom) === formatDate(newDateFrom) &&
        formatDate(dateTo) === formatDate(newDateTo))
    );
  }, [validDate, dateFrom, newDateFrom, dateTo, newDateTo]);
  return (
    <>
      <div className="date-filter__picker-wrp mb-sm-3">
        <DatepickerInput
          value={dayjs(newDateFrom.toDate()).format('YYYY-MM-DD')}
          onClick={() => {
            isOpen === 'from-date' ? setIsOpen('') : setIsOpen('from-date');
          }}
        />
        <i className="date-filter__picker-wrp-icon icon-calendar-m"></i>
        {isOpen === 'from-date' && (
          <DatePicker
            onFocus={() => setIsOpen('from-date')}
            selected={newDateFrom.toDate()}
            onChange={date => {
              setIsOpen('');
              setNewDateFrom(dayjs(date as Date));
            }}
            dateFormat="yyyy-MM-dd"
            maxDate={dateTo.toDate()}
            inline
          />
        )}
        <i className="date-filter__picker-wrp-icon icon-calendar-m"></i>
      </div>
      <span className="text-gray-400 mx-auto mx-sm-1 mb-sm-3">-</span>
      <div className="date-filter__picker-wrp mb-sm-3">
        <DatepickerInput
          value={dayjs(newDateTo.toDate()).format('YYYY-MM-DD')}
          onClick={() => {
            isOpen === 'to-date' ? setIsOpen('') : setIsOpen('to-date');
          }}
        />
        <i className="date-filter__picker-wrp-icon icon-calendar-m"></i>
        {isOpen === 'to-date' && (
          <DatePicker
            onFocus={() => setIsOpen('to-date')}
            minDate={newDateFrom.toDate()}
            selected={newDateTo.toDate()}
            onChange={date => {
              setIsOpen('');
              setNewDateTo(dayjs(date as Date));
            }}
            dateFormat="yyyy-MM-dd"
            maxDate={dayjs().toDate()}
            inline
          />
        )}
      </div>
      <Button
        className="mt-3 mt-sm-0 ml-sm-2 mr-auto mb-sm-3 btn--small-radius"
        variant="primary"
        disabled={disabledSearchBtn}
        onClick={() => {
          updateUrl(newDateFrom, newDateTo);
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

  const questionItems = useMemo(
    () => [
      {
        title: t('transactions_question_1'),
        body: t('transactions_answer_1'),
      },
      {
        title: t('transactions_question_2'),
        body: t('transactions_answer_2'),
      },
    ],
    [t],
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
      <h1 className="mb-4">{t('transactions_page_title')}</h1>
      <div className="date-filter mb-4 pb-sm-2">
        <TransactionsDateFilter
          dateTo={dateTo}
          dateFrom={dateFrom}
          updateUrl={updateUrl}
        />
        <TransactionsPeriodFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          updateUrl={updateUrl}
        />
      </div>
      <TransactionsTable
        dateTo={dateTo}
        dateFrom={dateFrom}
        updateUrl={updateUrl}
        data={data}
      />
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
