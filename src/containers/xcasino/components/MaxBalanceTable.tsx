import React, { Dispatch, SetStateAction } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import useApi from '../../../hooks/useApi';
import clsx from 'clsx';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useI18n } from '../../../hooks/useI18n';

const MaxBalanceTable = ({
  setShowLimit,
  title,
  needsOptions,
}: {
  setShowLimit?: Dispatch<
    SetStateAction<{ data: any; type?: string | undefined } | null>
  >;
  title?: string;
  needsOptions?: boolean;
}) => {
  const { data, error } = useApi('/railsapi/v1/user/max_balance_limit');
  const { user } = useAuth();
  const { t } = useI18n();
  const isDataLoading = !data && !error;

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
      <h5 className={'pt-3'}>{title}</h5>
      <Table>
        <thead>
          <tr>
            <th>{t('max_balance_limit')}</th>
            {needsOptions && <th className="text-md-right">Options</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            {!isDataLoading ? (
              <>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">{t('max_balance_limit')}</span>
                  <td>
                    {!data?.Data?.data
                      ? 'Not set'
                      : user.currency + data.Data.data}
                  </td>
                </div>
                {needsOptions && (
                  <div className="mobile-td-wrp">
                    <span className="mobile-th">Options</span>
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
