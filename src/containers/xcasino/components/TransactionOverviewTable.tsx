import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import useApi from '../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';
import { useI18n } from '../../../hooks/useI18n';

const TransactionOverviewTable = () => {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const { data, error } = useApi('/restapi/v1/user/session_details');
  const isDataLoading = !data && !error;

  return (
    <>
      <h6 className="overview-table__title" onClick={() => setShow(!show)}>
        {t('transactions_overview_title')}
      </h6>
      <Table>
        <thead>
          <tr>
            <th>{t('transactions_overview_current_balance')}</th>
            <th>{t('transactions_overview_initial_balance')}</th>
            <th>{t('transactions_overview_total_losses')}</th>
            <th>{t('transactions_overview_total_profit')}</th>
            <th>{t('transactions_overview_total_stake')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {isDataLoading ? (
              <div className="mobile-td-wrp">
                <span className="mobile-th">
                  {t('transactions_overview_loading')}
                </span>
                <td colSpan={5} className="overview-table__loading-row">
                  <Spinner animation="border" size="sm" />
                </td>
              </div>
            ) : (
              <>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">
                    {t('transactions_overview_current_balance')}
                  </span>
                  <td>{data.Data.CurrentBalance}</td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">
                    {t('transactions_overview_initial_balance')}
                  </span>
                  <td>{data.Data.InitialBalance}</td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">
                    {t('transactions_overview_total_losses')}
                  </span>
                  <td>{data.Data.TotalLosses}</td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">
                    {t('transactions_overview_total_profit')}
                  </span>
                  <td>{data.Data.TotalProfits}</td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">
                    {t('transactions_overview_total_stake')}
                  </span>
                  <td>{data.Data.TotalStake}</td>
                </div>
              </>
            )}
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default TransactionOverviewTable;
