import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import CustomAlert from '../components/CustomAlert';
import Table from 'react-bootstrap/Table';
import useApi from '../../../hooks/useApi';
import SettingsForm from '../components/account-settings/SettingsForm';
import { SettingsField } from '../../../types/api/user/ProfileSettings';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import { useAuth } from '../../../hooks/useAuth';
import dayjs from 'dayjs';
import { LimitData } from '../../../types/api/user/Limits';
import { franchiseDateFormat, Franchise } from '../../../constants';
import { sortAscending } from '../../../utils';
import clsx from 'clsx';
import utc from 'dayjs/plugin/utc';
import { formatUrl } from '../../../utils/apiUtils';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import TablePagination from '../components/account-settings/TablePagination';
import NumberFormat from 'react-number-format';
dayjs.extend(utc);

interface LimitProps {
  limitData: {
    id: string;
    title: string;
    note: string;
    fields: SettingsField[];
    action: string;
    disabled?: boolean;
    data: LimitData[];
  };
  mutate: () => void;
}

const timeoutCards = ['disable_player_time_out', 'self_exclusion'];

const TimeoutCard = ({ limitData, mutate }: LimitProps) => {
  const { t, jsxT } = useI18n();
  const { user } = useAuth();
  const [active, setActive] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const fixedData = limitData.fields
    .filter(limit => limit.disabled && limit.value)
    .map(item => {
      return { id: item.id, value: item.value };
    });
  const disabledUntilDate =
    user.player_timeout && dayjs(new Date(user.player_timeout['DisableUntil']));
  const isSelfExcluded =
    disabledUntilDate && disabledUntilDate?.year() - dayjs().year() > 5;

  return (
    <Accordion
      className={clsx(
        (Franchise.gnogaz || Franchise.gnogon) &&
          active &&
          'info-container--active',
        'info-container info-container--gray mb-3',
      )}
    >
      <div className="info-container__info pt-3">
        <div className="d-flex align-items-center">
          <p className="info-container__title pr-3">
            <b>{t(limitData.title)}</b>
          </p>
          {!limitData.disabled && (
            <Accordion.Toggle
              as="button"
              eventKey={limitData.id}
              onClick={() => setActive(!active)}
              className={clsx(
                'info-container__edit btn btn-sm px-3 ml-auto',
                window.__config__.name === 'strive'
                  ? 'btn-light'
                  : 'btn-secondary',
              )}
            >
              {jsxT('timeout_edit')}
            </Accordion.Toggle>
          )}
        </div>
        <p className="text-14 pt-1">{t(limitData.note)}</p>
      </div>
      <div className="info-container__text">
        <p className="text-gray-400 mb-0">
          {limitData.id === 'self_exclusion'
            ? disabledUntilDate && isSelfExcluded
              ? jsxT('player_disabled_indefinite')
              : jsxT('timeout_unset')
            : disabledUntilDate && !isSelfExcluded
            ? `${t('player_disabled_until')}: ${disabledUntilDate.format(
                'YYYY-MM-DD',
              )}`
            : jsxT('timeout_unset')}
        </p>
        {!limitData.disabled && (
          <Accordion.Collapse eventKey={limitData.id}>
            <>
              {window.__config__.name === 'strive' && (
                <hr className="pt-1 mb-0"></hr>
              )}
              <CustomAlert
                show={!!apiResponse}
                variant={
                  (apiResponse &&
                    (apiResponse.success ? 'success' : 'danger')) ||
                  ''
                }
                className="mb-0 mt-2"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }}
                />
              </CustomAlert>
              <SettingsForm
                id={limitData.id}
                fields={limitData.fields}
                action={limitData.action}
                setResponse={setApiResponse}
                fixedData={fixedData}
                mutateData={mutate}
                translatableDefaultValues={true}
              />
            </>
          </Accordion.Collapse>
        )}
      </div>
    </Accordion>
  );
};

const limitTypeOrder = ['Day', 'Week', 'Month'];
const LimitsCard = ({ limitData, mutate }: LimitProps) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [active, setActive] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const fixedData = limitData.fields
    .filter(limit => limit.disabled && limit.value)
    .map(item => {
      return { id: item.id, value: item.value };
    });

  return (
    <Accordion
      className={clsx(
        (Franchise.gnogaz || Franchise.gnogon) &&
          active &&
          'info-container--active',
        'info-container mb-3',
      )}
    >
      <div className="info-container__info pt-3">
        <div className="d-flex align-items-center">
          <p className="info-container__title pr-3">
            <b>{t(limitData.title)}</b>
          </p>
          {!limitData.disabled && (
            <Accordion.Toggle
              as="button"
              eventKey={limitData.id}
              onClick={() => setActive(!active)}
              className={clsx(
                'info-container__edit btn btn-sm px-3 ml-auto',
                window.__config__.name === 'strive'
                  ? 'btn-light'
                  : 'btn-secondary',
              )}
            >
              {t('limits_edit')}
            </Accordion.Toggle>
          )}
        </div>
        <p className="text-14 pt-1">{t(limitData.note)}</p>
      </div>
      <div className="info-container__text">
        {limitData.data.length ? (
          limitData.data
            .sort((a, b) =>
              sortAscending(
                limitTypeOrder.indexOf(a.LimitType),
                limitTypeOrder.indexOf(b.LimitType),
              ),
            )
            .map((limit, i) => {
              let formattedCurrentLimit: string | number | null = null;
              let formattedFutureLimit: string | number | null = null;
              switch (limit.Formatting) {
                case 'hour': {
                  const totalMinutes =
                    limit.LimitAmount * 60 - (limit.AccumulatedDuration || 0);
                  if (totalMinutes > 0) {
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    let hoursFormatting = hours.toString();
                    if (!!minutes) {
                      hoursFormatting += `:${
                        minutes < 10 ? '0' : ''
                      }${minutes}`;
                    }
                    formattedCurrentLimit = `${hoursFormatting} ${t(
                      'limits_hours',
                    )}`;
                  } else {
                    formattedCurrentLimit = `0 ${t('limits_hours')}`;
                  }
                  formattedFutureLimit = limit.FutureLimitAmount
                    ? `${limit.FutureLimitAmount} ${t('limits_hours')}`
                    : null;
                  break;
                }
                case 'currency': {
                  formattedCurrentLimit = limit.LimitAmount;
                  formattedFutureLimit = limit.FutureLimitAmount
                    ? limit.FutureLimitAmount
                    : null;
                  break;
                }
              }

              let formattedUsedLimit: string | number | null = null;
              if (limit.Formatting === 'currency') {
                const used =
                  limit.LimitAmount != null && limit.AmountLeft != null
                    ? Number((limit.LimitAmount - limit.AmountLeft).toFixed(2))
                    : null;
                formattedUsedLimit = used || '0';
              }
              let formattedRemainingLimit: string | number | null =
                limit.Formatting === 'currency'
                  ? limit.AmountLeft ?? limit.LimitAmount
                  : null;

              let formattedFutureLimitFrom:
                | string
                | number
                | null = limit.FutureLimitValidFrom
                ? dayjs(limit.FutureLimitValidFrom).format(
                    `${franchiseDateFormat} HH:mm`,
                  )
                : null;

              const lastLimit = i + 1 === limitData.data.length;
              return (
                <div>
                  <p className="mt-1 play-limits-title">
                    {t(`limit_type_${limit.LimitType.toLowerCase()}`)}
                  </p>
                  <ul className="list-unstyled mb-0 play-limits">
                    <li className="play-limits__limit">
                      <p className="play-limits__limit-title">
                        {t('current_limit')}
                      </p>
                      <p
                        className={clsx(
                          'play-limits__limit-total',
                          window.__config__.name === 'strive' && 'text-primary',
                        )}
                      >
                        {limit.Formatting === 'currency' ? (
                          <NumberFormat
                            value={formattedCurrentLimit}
                            displayType={'text'}
                            thousandSeparator
                            prefix={user.currency}
                          />
                        ) : (
                          formattedCurrentLimit
                        )}
                      </p>
                    </li>
                    {formattedUsedLimit !== null && (
                      <li className="play-limits__limit">
                        <p className="play-limits__limit-title">
                          {t('used_limit')}
                        </p>
                        <p className="play-limits__limit-total">
                          {limit.Formatting === 'currency' ? (
                            <NumberFormat
                              value={formattedUsedLimit}
                              displayType={'text'}
                              thousandSeparator
                              prefix={user.currency}
                            />
                          ) : (
                            formattedUsedLimit
                          )}
                        </p>
                      </li>
                    )}
                    {formattedRemainingLimit != null && (
                      <li className="play-limits__limit">
                        <p className="play-limits__limit-title">
                          {t('left_limit')}
                        </p>
                        <p className="play-limits__limit-total">
                          {limit.Formatting === 'currency' ? (
                            <NumberFormat
                              value={formattedRemainingLimit}
                              displayType={'text'}
                              thousandSeparator
                              prefix={user.currency}
                            />
                          ) : (
                            formattedRemainingLimit
                          )}
                        </p>
                      </li>
                    )}
                    {formattedFutureLimit != null && (
                      <>
                        <li className="play-limits__limit">
                          <p className="play-limits__limit-title">
                            {t('future_limit')}
                          </p>
                          <p
                            className={clsx(
                              'play-limits__limit-total',
                              window.__config__.name === 'strive' &&
                                'text-primary',
                            )}
                          >
                            {limit.Formatting === 'currency' ? (
                              <NumberFormat
                                value={formattedFutureLimit}
                                displayType={'text'}
                                thousandSeparator
                                prefix={user.currency}
                              />
                            ) : (
                              formattedFutureLimit
                            )}
                          </p>
                        </li>
                        <li className="play-limits__limit">
                          <p className="play-limits__limit-title">
                            {t('future_from_limit')}
                          </p>
                          <p className="play-limits__limit-total">
                            {formattedFutureLimitFrom}
                          </p>
                        </li>
                      </>
                    )}
                  </ul>
                  {limit.ValidTo &&
                    !limit.FutureLimitAmount &&
                    !limit.FutureLimitValidFrom && (
                      <p
                        className={clsx(
                          'mt-1',
                          lastLimit ? 'mb-0 pb-2' : 'pb-3',
                        )}
                      >
                        {t('limit_valid_until')}{' '}
                        <b>
                          {dayjs(limit.ValidTo).format(
                            `${franchiseDateFormat} HH:mm`,
                          )}
                        </b>
                      </p>
                    )}
                </div>
              );
            })
        ) : (
          <p className="text-gray-400 mb-0">{t('limit_unset')}</p>
        )}
        {!limitData.disabled && (
          <Accordion.Collapse eventKey={limitData.id}>
            <>
              {window.__config__.name === 'strive' && (
                <hr className="pt-1 mb-0"></hr>
              )}
              <CustomAlert
                show={!!apiResponse}
                variant={
                  (apiResponse &&
                    (apiResponse.success ? 'success' : 'danger')) ||
                  ''
                }
                className="mb-0 mt-2"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }}
                />
              </CustomAlert>
              <SettingsForm
                id={limitData.id}
                fields={limitData.fields}
                action={limitData.action}
                setResponse={setApiResponse}
                fixedData={fixedData}
                mutateData={mutate}
                translatableDefaultValues={true}
                formData={limitData.data}
              />
            </>
          </Accordion.Collapse>
        )}
      </div>
    </Accordion>
  );
};

type LimitsHistoryData = {
  TotalPages: number;
  LimitsHistory: {
    Id: number;
    PlayerId: number;
    CreatedAt: string;
    Amount: any;
    LimitTypeToString: string;
    LimitDurationToString: string;
    IsDeleted: boolean;
  }[];
};

const timeLimits = ['GambleTimeLimit', 'SessionTimeLimit'];
const LimitsHistory = ({ limitsData }) => {
  const { t, jsxT } = useI18n();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, mutate } = useApi<RailsApiResponse<LimitsHistoryData>>(
    formatUrl(`/restapi/v1/user/limits_history`, {
      page_size: 10,
      page_number: currentPage,
    }),
  );
  const totalPages: number = (!!data && data.Data?.TotalPages) || 0;

  useEffect(() => {
    mutate();
  }, [limitsData]);

  return (
    <div className="info-container mb-3">
      <div className="info-container__info pt-3">
        <div className="d-flex align-items-center">
          <p className="info-container__title pr-3">
            <b>{t('limits_history')}</b>
          </p>
        </div>
      </div>
      <div className="info-container__text">
        {!data ? (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="brand" className="mx-auto" />
          </div>
        ) : !!data && data?.Data.LimitsHistory?.length ? (
          <div className="table-container d-flex flex-column mb-2">
            <Table hover className="limits-history-table">
              <thead>
                <tr>
                  <th>{t('_date')}</th>
                  <th>{t('save')}</th>
                  <th>{t('amount')}</th>
                </tr>
              </thead>
              <tbody>
                {data.Data.LimitsHistory.map((limit, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <strong className="heading-sm">{t('_date')}</strong>
                        {dayjs(new Date(limit.CreatedAt)).format('YYYY-MM-DD')}
                      </td>
                      <td>
                        <strong className="heading-sm">{t('save')}</strong>
                        <strong>
                          {t(limit.LimitTypeToString)}{' '}
                          {limit.LimitDurationToString &&
                            ` - ${t(limit.LimitDurationToString)}`}
                        </strong>
                      </td>
                      <td>
                        <strong className="heading-sm">{t('amount')}</strong>
                        <div className="d-inline-flex align-items-center">
                          {timeLimits.includes(limit.LimitTypeToString) ? (
                            `${limit.Amount} ${t('hours')}`
                          ) : (
                            <NumberFormat
                              value={limit.Amount}
                              thousandSeparator
                              displayType={'text'}
                              prefix={user.currency}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {totalPages > 1 && (
              <TablePagination
                data={data}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        ) : (
          <h2 className="my-3 text-center">{t('limits_no_data')}</h2>
        )}
      </div>
    </div>
  );
};

const questionItems = [
  { title: 'limits_question_1', body: 'limits_answer_1' },
  { title: 'limits_question_2', body: 'limits_answer_2' },
];

const LimitsPage = () => {
  const { t, jsxT } = useI18n();
  const { data, error, mutate } = useApi<any>(
    '/restapi/v1/user/profile/play_limits',
  );
  const isDataLoading = !data && !error;

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title">{jsxT('limits_page_title')}</h1>
      <p className="account-settings__sub-text">
        {jsxT('limits_page_sub_text')}
      </p>
      {window.__config__.name === 'strive' && (
        <div className="play-responsible-block mb-3 px-2">
          <i className={clsx(`icon-${window.__config__.name}-thumbs`)}></i>
          {jsxT('play_responsible_block_link')}
        </div>
      )}
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {!!error && (
        <h2 className="mt-3 mb-5 text-center">
          {jsxT('settings_page_failed_to_load')}
        </h2>
      )}
      {!!data && (
        <>
          {data.limits.map(limit =>
            timeoutCards.includes(limit.id) ? (
              <TimeoutCard key={limit.id} limitData={limit} mutate={mutate} />
            ) : (
              <LimitsCard key={limit.id} limitData={limit} mutate={mutate} />
            ),
          )}
        </>
      )}
      <LimitsHistory limitsData={data} />
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['faq', 'phone', 'email']}
        className="d-block d-xl-none"
      />
    </main>
  );
};

export default LimitsPage;
