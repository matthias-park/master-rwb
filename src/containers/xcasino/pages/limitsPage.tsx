import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
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

export const TimeoutRow = ({
  limitType,
  limit,
  setShowLimit,
}: {
  limitType: string;
  limit: any;
  setShowLimit?: () => void;
}) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const excludedUntil = dayjs(user.player_timeout?.DisableUntil).format(
    'YYYY-MM-DD',
  );
  const excludedIndef = dayjs(excludedUntil)?.diff(dayjs(), 'year') > 50;
  const disabledTableMsg = (() => {
    if (!!user.player_timeout) {
      if (excludedIndef && limit.id === 'self_exclusion') {
        return t('timeout_set_indefinitely');
      }
      if (!excludedIndef && limit.id === 'disable_player_time_out') {
        return `${t('timeout_set')} ${excludedUntil}`;
      }
      return t('timeout_unset');
    } else {
      return t('timeout_unset');
    }
  })();
  return (
    <tr>
      <div className="mobile-td-wrp">
        <span className="mobile-th">{t('limits_table_type')}</span>
        <td>{t(limitType)}</td>
      </div>
      <div className="mobile-td-wrp">
        <span className="mobile-th">{t('limits_table_remaining')}</span>
        <td>{disabledTableMsg}</td>
      </div>
      {setShowLimit && (
        <div className="mobile-td-wrp">
          <span className="mobile-th">{t('limits_table_options')}</span>
          <td className="text-center text-md-right">
            <i className={clsx('icon-circle-plus')} onClick={setShowLimit} />
          </td>
        </div>
      )}
    </tr>
  );
};

export const TimeoutTable = ({
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
  const { t } = useI18n();
  return (
    <>
      <h5>{title}</h5>
      <Table hover responsive>
        <thead>
          <tr>
            <th>{t('limits_table_type')}</th>
            <th>{t('limits_table_remaining')}</th>
            <th className="text-center text-md-right">
              {t('limits_table_options')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(limit => (
            <TimeoutRow
              limit={limit}
              limitType={limit.id}
              setShowLimit={() => setShowLimit({ data: limit, type: limit.id })}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export const LimitContainer = ({
  hideLimit,
  limitData,
  setApiResponse,
  mutate,
}) => {
  const { data, type } = limitData;
  const { t } = useI18n();

  const fields = useRef<any[]>([]);
  const fixedData = useRef<any[]>([]);
  const [fixedDataLoading, setFixedDataLoading] = useState(true);
  useEffect(() => {
    data.blocks.forEach(item => {
      item.fields.forEach(field => {
        fields.current.push(field);
      });
    });
    fixedData.current = fields.current
      .filter(limit => limit.disabled && limit.value)
      .map(item => {
        return { id: item.id, value: item.value };
      });
    setFixedDataLoading(false);
  }, []);

  return (
    <div className="fade-in">
      <h6 className="account-page__content-title">{t(data.title)}</h6>
      <p className="account-page__content-text">{t(data.note)}</p>
      <div className="limit-field-container">
        {!fixedDataLoading && (
          <SettingsForm
            id={data.id}
            fields={data.fields}
            blocks={{
              items: data.blocks,
              className: 'limit-field-container__block',
            }}
            actionButtonOnClick={hideLimit}
            action={data.action}
            setResponse={setApiResponse}
            successCallback={hideLimit}
            mutateData={mutate}
            fixedData={fixedData.current}
            focusInput={
              !!type?.includes('limit') && `limit_amount_${type.toLowerCase()}`
            }
            translatableDefaultValues={data.id === 'self_exclusion'}
          />
        )}
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
        <span className="mobile-th">{t('limits_table_type')}</span>
        <span className="mobile-th">{t('limits_table_time')}</span>
        <td>{t(limitType)}</td>
      </div>
      <div className="mobile-td-wrp">
        <span className="mobile-th">{t('limits_table_time')}</span>
        <td>{limitAmount}</td>
      </div>
      <div className="mobile-td-wrp">
        <span className="mobile-th">{t('limits_table_remaining')}</span>
        {!!sessionAmountLeft ? (
          <td>{sessionAmountLeft}</td>
        ) : (
          <td>{limit?.['AmountLeft'] ? amountLeft : ''}</td>
        )}
      </div>
      <div className="mobile-td-wrp">
        <span className="mobile-th">{t('limits_table_valid_from')}</span>
        <td>{validFrom}</td>
      </div>
      {setShowLimit && (
        <div className="mobile-td-wrp">
          <span className="mobile-th">{t('limits_table_options')}</span>
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
  const { t } = useI18n();
  return (
    <>
      <h5>{title}</h5>
      <Table hover responsive>
        <thead>
          <tr>
            <th>{t('limits_table_type')}</th>
            <th>{t('limits_table_time')}</th>
            <th>{t('limits_table_remaining')}</th>
            <th>{t('limits_table_valid_from')}</th>
            <th>{t('limits_table_options')}</th>
          </tr>
        </thead>
        <tbody>
          {!!data &&
            data?.map(limit => (
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
    '/restapi/v1/user/profile/play_limits',
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
    title: t('limits_page_title'),
    text: t('limits_page_sub_text'),
  };

  const limitData = data?.limits.filter(
    limit => !['disable_player_time_out', 'self_exclusion'].includes(limit.id),
  );

  const exclusionData = data?.limits.filter(limit =>
    ['disable_player_time_out', 'self_exclusion'].includes(limit.id),
  );

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
              <h6 className="account-page__content-title">
                {t('limits_table_title')}
              </h6>
              <LimitTable setShowLimit={setShowLimit} data={limitData} />
              <MaxBalanceTable setShowLimit={setShowLimit} needsOptions />
              <hr className="mb-4 divider-solid-light" />
              <h6 className="account-page__content-title">
                {t('self_exclusion_title')}
              </h6>
              <TimeoutTable setShowLimit={setShowLimit} data={exclusionData} />
            </>
          )}
        </div>
      )}
    </AccountPageTemplate>
  );
};

export default LimitsPage;
