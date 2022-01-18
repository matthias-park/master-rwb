import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import useApi from '../../../hooks/useApi';
import clsx from 'clsx';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useI18n } from '../../../hooks/useI18n';
import dayjs from 'dayjs';

const MaxBalanceTable = ({
  setShowLimit,
  title,
  needsOptions,
  currency,
}: {
  setShowLimit?: Dispatch<
    SetStateAction<{ data: any; type?: string | undefined } | null>
  >;
  title?: string;
  needsOptions?: boolean;
  currency?: string | undefined | null;
}) => {
  const { data, error } = useApi('/railsapi/v1/user/max_balance_limit');
  const [maxBalance, setMaxBalance] = useState(null);
  const [validFrom, setValidFrom] = useState(null);
  const [remainingBalance, setRemainingBalance] = useState<number | null>(null);
  const { user } = useAuth();
  const { t } = useI18n();
  const isDataLoading = !data && !error;

  useEffect(() => {
    if (!isDataLoading) {
      !!data?.Data.futurelimitamount
        ? setMaxBalance(data?.Data.futurelimitamount)
        : setMaxBalance(data?.Data?.data);

      if (user.balance) {
        setRemainingBalance(data?.Data.data - user?.balance);
      }

      if (!!data?.Data.data) {
        setValidFrom(
          !!data?.Data.futurelimitvalidfrom
            ? dayjs(data.Data?.futurelimitvalidfrom).format(
                `${window.__config__.dateFormat} HH:MM`,
              )
            : t('active'),
        );
      }
    }
  }, [data]);

  const limitData = {
    data: {
      id: 'max_balance_limit',
      title: 'set_max_balance_limit',
      note: 'max_balance_limit_note',
      action:
        'https://pla-dev.tglab.dev/railsapi/v1/user/set_max_balance_limit',
      data: [],
      blocks: [
        {
          fields: [
            {
              id: 'amount',
              title: 'amount',
              type: 'text',
              disabled: false,
              default: null,
            },
          ],
        },
        {
          fields: [
            {
              id: 'cancel_button',
              title: 'cancel_limit_button',
              type: 'button',
            },
            {
              id: 'submit_button',
              title: 'deposit_limit_button',
              type: 'submit',
            },
          ],
        },
      ],
    },
  };

  return (
    <>
      <h5>{title}</h5>
      <Table>
        <thead>
          <tr>
            <th>{t('max_balance_limit')}</th>
            <th>{t('limits_table_remaining')}</th>
            <th>{t('limits_table_valid_from')}</th>
            {needsOptions && (
              <th className="text-md-right">{t('limits_table_options')}</th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            {!isDataLoading ? (
              <>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">{t('max_balance_limit')}</span>
                  <td>
                    {!!maxBalance
                      ? (user.currency || currency) + String(maxBalance)
                      : 'Not set'}
                  </td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">
                    {t('limits_table_remaining')}
                  </span>
                  <td>
                    {!!remainingBalance &&
                      (user.currency || currency) + String(remainingBalance)}
                  </td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">
                    {t('limits_table_valid_from')}
                  </span>
                  <td>{validFrom}</td>
                </div>
                {needsOptions && (
                  <div className="mobile-td-wrp">
                    <span className="mobile-th">
                      {t('limits_table_options')}
                    </span>
                    <td className="text-center text-md-right">
                      <i
                        className={clsx(
                          !!data?.Data.data ? 'icon-edit' : 'icon-circle-plus',
                        )}
                        onClick={() =>
                          !!setShowLimit && setShowLimit(limitData)
                        }
                      />
                    </td>
                  </div>
                )}
              </>
            ) : (
              <div className="mobile-td-wrp">
                <span className="mobile-th">{t('max_balance_limit')}</span>
                <td colSpan={5} className="max-balance-table__loading-row">
                  <Spinner animation="border" size="sm" />
                </td>
              </div>
            )}
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default MaxBalanceTable;
