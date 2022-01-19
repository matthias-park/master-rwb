import React, { useState, useEffect, useMemo } from 'react';
import AccountPageTemplate from '../components/account-settings/AccountTemplate';
import PaginationTable from '../components/account-settings/PaginationTable';
import DateFilter from '../components/account-settings/DateFilter';
import useApi from '../../../hooks/useApi';
import useLocalStorage from '../../../hooks/useLocalStorage';
import dayjs, { Dayjs } from 'dayjs';
import { formatUrl } from '../../../utils/apiUtils';
import TransactionOverviewTable from '../components/TransactionOverviewTable';
import { useI18n } from '../../../hooks/useI18n';

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

const TransactionsPage = () => {
  const { t } = useI18n();
  const [url, setUrl] = useState<string | null>(null);
  const { data } = useApi<Transactions>(url);
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
  const formatTransactions:
    | {
        transaction_date: string;
        transaction_title: string;
        transaction_amount: string;
        transaction_account: string;
      }[]
    | undefined = useMemo(() => {
    return data?.transactions?.map(transaction => ({
      transaction_date: dayjs(new Date(transaction.date)).format('YYYY-MM-DD'),
      transaction_title: transaction.title,
      transaction_account:
        transaction.account_number?.match(/.{1,4}/g)?.join(' ') || '-',
      transaction_amount: `${transaction.in ? '+' : '-'} ${transaction.amount}`,
    }));
  }, [data]);

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

  const content = {
    title: t('transactions_page_title'),
    text: t('transactions_history_disclaimer'),
  };

  return (
    <AccountPageTemplate
      className="transactions-page"
      title={content.title}
      text={content.text}
    >
      <DateFilter
        title={t('date_picker_title')}
        dateTo={dateTo}
        dateFrom={dateFrom}
        updateUrl={updateUrl}
      />
      <TransactionOverviewTable />
      <PaginationTable
        data={formatTransactions}
        updateUrl={updateUrl}
        dateFrom={dateFrom}
        dateTo={dateTo}
        totalPages={data?.pages}
      />
    </AccountPageTemplate>
  );
};

export default TransactionsPage;
