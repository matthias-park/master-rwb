import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { useAuth } from '../../../hooks/useAuth';
import dayjs, { Dayjs } from 'dayjs';
import clsx from 'clsx';
import 'react-datepicker/dist/react-datepicker.css';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useLocalStorage from '../../../hooks/useLocalStorage';
import TablePagination from '../components/account-settings/TablePagination';
import NumberFormat from 'react-number-format';
import DateFilter from '../components/account-settings/DateFilter';
import { postApi } from '../../../utils/apiUtils';

interface CasinoBet {
  Id: number;
  CreatedAt: string;
  GameName: string;
  BetAmount: number;
  WinAmount: number;
  BonusBetAmount: number;
  BonusWinAmount: number;
}

const CasinoBetsTable = ({ dateTo, dateFrom, data, updateUrl }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const betsData = [...data].reverse();
  const itemsPerPage = 10;
  const takeFrom = (currentPage - 1) * itemsPerPage;
  const takeTo = (currentPage - 1) * itemsPerPage + itemsPerPage;
  const totalPages = Math.ceil(data.length / itemsPerPage);

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
      ) : data?.length ? (
        <div className="table-container d-flex flex-column mb-4">
          <Table hover>
            <thead>
              <tr>
                <th>{t('_date')}</th>
                <th>{t('game')}</th>
                <th>{t('wager')}</th>
                <th>{t('payout')}</th>
              </tr>
            </thead>
            <tbody>
              {betsData.slice(takeFrom, takeTo).map((bet, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <strong className="heading-sm">{t('_date')}</strong>
                      {dayjs(new Date(bet.CreatedAt)).format('YYYY-MM-DD')}
                    </td>
                    <td>
                      <strong className="heading-sm">{t('game')}</strong>
                      {bet.GameName}
                    </td>
                    <td>
                      <strong className="heading-sm">{t('wager')}</strong>
                      <span>
                        <NumberFormat
                          value={bet.BetAmount + bet.BonusBetAmount}
                          thousandSeparator
                          displayType={'text'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          prefix={user.currency}
                        />
                      </span>
                    </td>
                    <td>
                      <strong className="heading-sm">{t('payout')}</strong>
                      <span
                        className={clsx(
                          bet.WinAmount + bet.BonusWinAmount > 0 &&
                            'text-success',
                        )}
                      >
                        <NumberFormat
                          value={bet.WinAmount + bet.BonusWinAmount}
                          thousandSeparator
                          displayType={'text'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          prefix={user.currency}
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
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : (
        <h2 className="mt-3 mb-5 text-center">{t('transactions_no_data')}</h2>
      )}
    </div>
  );
};

const CasinoBetsPage = () => {
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
  const [data, setData] = useState<CasinoBet[]>([]);

  const updateUrl = async (from?: Dayjs, to?: Dayjs) => {
    const resp = await postApi<RailsApiResponse<CasinoBet[]>>(
      '/restapi/v1/user/casino_bets',
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
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  return (
    <main className="container-fluid px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title mb-4">
        {t('casino_bets_page_title')}
      </h1>
      <div className="outer-info-block p-4 mb-4">
        <DateFilter
          dateTo={dateTo}
          dateFrom={dateFrom}
          updateUrl={updateUrl}
          className="p-3"
          withPeriods
        />
        <CasinoBetsTable
          dateTo={dateTo}
          dateFrom={dateFrom}
          updateUrl={updateUrl}
          data={data}
        />
      </div>
    </main>
  );
};

export default CasinoBetsPage;
