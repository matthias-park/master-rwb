import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import AccountPageTemplate from '../components/account-settings/AccountTemplate';
import useApi from '../../../hooks/useApi';
import { useI18n } from '../../../hooks/useI18n';
import { useAuth } from '../../../hooks/useAuth';
import Spinner from 'react-bootstrap/Spinner';
import CustomAlert from '../components/CustomAlert';
import SettingsForm from '../components/account-settings/SettingsForm';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { sortAscending } from '../../../utils';
import MaxBalanceTable from '../components/MaxBalanceTable';
import RailsApiResponse from '../../../types/api/RailsApiResponse';

export const LimitContainer = ({
  hideLimit,
  limitData,
  setApiResponse,
  mutate,
}) => {
  const { data, type } = limitData;
  const { t } = useI18n();
  return (
    <div className="fade-in">
      <h6 className="account-page__content-title">{t(data.title)}</h6>
      <p className="account-page__content-text">{t(data.note)}</p>
      <div className="limit-field-container">
        <SettingsForm
          id={data.id}
          blocks={{
            items: data.blocks,
            className: 'limit-field-container__block',
          }}
          actionButtonOnClick={hideLimit}
          action={data.action}
          setResponse={setApiResponse}
          successCallback={hideLimit}
          mutateData={mutate}
          focusInput={type && `limit_amount_${type.toLowerCase()}`}
        />
      </div>
    </div>
  );
};

export const LimitRow = ({
  limitType,
  limit,
  setShowLimit,
  currency,
}: {
  limitType: string;
  limit: any;
  setShowLimit?: () => void;
  currency?: string | undefined | null;
}) => {
  const { user } = useAuth();
  const { t } = useI18n();

  let prefix;
  switch (limitType) {
    case 'deposit_limit_count':
      prefix = '';
      break;
    case 'session_limit':
      prefix = 'hours ';
      break;
    default:
      prefix = user.currency || currency;
  }

  let sessionAmountLeft: string | null = null;
  const totalMinutes =
    limit.LimitAmount * 60 - (limit.AccumulatedDuration || 0);
  if (totalMinutes > 0 && limit.AccumulatedDuration !== undefined) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let hoursFormatting = hours.toString();
    if (!!minutes) {
      hoursFormatting += `:${minutes < 10 ? '0' : ''}${minutes}`;
    }
    sessionAmountLeft = `${hoursFormatting} ${t('limits_hours')}`;
  }

  const amountLeft = `${limit?.['AmountLeft'] ?? limit?.['LimitAmount']} 
  ${limit?.['AmountLeft'] && prefix}`;

  const limitAmount = limit?.['FutureLimitAmount']
    ? `${limit?.['FutureLimitAmount']} ${prefix} ${t(
        'per_' + limit?.['LimitType'].toLowerCase(),
      )}`
    : limit?.['LimitAmount']
    ? `${limit?.['LimitAmount']} ${prefix} ${t(
        'per_' + limit?.['LimitType'].toLowerCase(),
      )}`
    : t('no_limit_set');

  const validFrom = limit?.['FutureLimitValidFrom']
    ? dayjs(limit?.['FutureLimitValidFrom']).format(
        `${window.__config__.dateFormat} HH:MM`,
      )
    : limit?.['LimitAmount']
    ? t('active')
    : '';

  return (
    <tr>
      <div className="mobile-td-wrp">
        <span className="mobile-th">Type</span>
        <td>{t(limitType)}</td>
      </div>
      <div className="mobile-td-wrp">
        <span className="mobile-th">Time</span>
        <td>{limitAmount}</td>
      </div>
      <div className="mobile-td-wrp">
        <span className="mobile-th">Remaining</span>
        {!!sessionAmountLeft ? (
          <td>{sessionAmountLeft}</td>
        ) : (
          <td>{limit?.['AmountLeft'] ? amountLeft : ''}</td>
        )}
      </div>
      <div className="mobile-td-wrp">
        <span className="mobile-th">Valid From</span>
        <td>{validFrom}</td>
      </div>
      {setShowLimit && (
        <div className="mobile-td-wrp">
          <span className="mobile-th">Options</span>
          <td className="text-center text-md-right">
            <i
              className={clsx(
                limit?.['LimitAmount'] ? 'icon-edit' : 'icon-circle-plus',
              )}
              onClick={setShowLimit}
            />
          </td>
        </div>
      )}
    </tr>
  );
};

export const LimitTable = ({
  data,
  setShowLimit,
  title,
}: {
  data: any;
  setShowLimit: Dispatch<
    SetStateAction<{ data: any; type?: string | undefined } | null>
  >;
  title?: string;
}) => {
  return (
    <>
      <h5>{title}</h5>
      <Table hover responsive>
        <thead>
          <tr>
            <th>Type</th>
            <th>Time</th>
            <th>Remaining</th>
            <th>Valid From</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {!!data &&
            data?.limits?.map(limit => (
              <>
                {limit?.data
                  ?.sort((a, b) =>
                    sortAscending(
                      limitTypeOrder.indexOf(a.LimitType),
                      limitTypeOrder.indexOf(b.LimitType),
                    ),
                  )
                  .map(limitData => (
                    <LimitRow
                      limitType={limit.id}
                      limit={limitData}
                      setShowLimit={() =>
                        setShowLimit({
                          data: limit,
                          type: limitData['LimitType'],
                        })
                      }
                    />
                  ))}
                {limit?.data.length !== 3 && (
                  <LimitRow
                    limitType={limit.id}
                    limit={{}}
                    setShowLimit={() => setShowLimit({ data: limit })}
                  />
                )}
              </>
            ))}
        </tbody>
      </Table>
    </>
  );
};

const limitTypeOrder = ['Day', 'Week', 'Month'];
const LimitsPage = () => {
  const { t, jsxT } = useI18n();
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/play_limits',
  );
  const isDataLoading = !data && !error;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const [showLimit, setShowLimit] = useState<{
    data: any;
    type?: string;
  } | null>(null);
  const content = {
    title: 'Limits',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Donec ullamcorper nulla non metus auctor fringilla.',
  };

  return (
    <AccountPageTemplate title={content['title']} text={content['text']}>
      <CustomAlert
        show={!!apiResponse}
        variant={
          (apiResponse && (apiResponse.success ? 'success' : 'danger')) || ''
        }
      >
        <div dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }} />
      </CustomAlert>
      {showLimit ? (
        <LimitContainer
          setApiResponse={setApiResponse}
          limitData={showLimit}
          hideLimit={() => setShowLimit(null)}
          mutate={mutate}
        />
      ) : (
        <div className="fade-in">
          {isDataLoading && (
            <div className="d-flex my-3">
              <Spinner animation="border" variant="white" />
            </div>
          )}
          {!!data && (
            <>
              <h6 className="account-page__content-title">Account Limits</h6>
              <LimitTable setShowLimit={setShowLimit} data={data} />
              <MaxBalanceTable setShowLimit={setShowLimit} needsOptions />
            </>
          )}
        </div>
      )}
    </AccountPageTemplate>
  );
};

export default LimitsPage;
