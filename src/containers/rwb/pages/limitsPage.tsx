import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import CustomAlert from '../components/CustomAlert';
import Table from 'react-bootstrap/Table';
import useApi from '../../../hooks/useApi';
import { postApi } from '../../../utils/apiUtils';
import SettingsForm from '../components/account-settings/SettingsForm';
import { SettingsField } from '../../../types/api/user/ProfileSettings';
import { useAuth } from '../../../hooks/useAuth';
import dayjs from 'dayjs';
import { LimitData } from '../../../types/api/user/Limits';
import clsx from 'clsx';
import utc from 'dayjs/plugin/utc';
import { formatUrl } from '../../../utils/apiUtils';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import TablePagination from '../components/account-settings/TablePagination';
import NumberFormat from 'react-number-format';
import { franchiseDateFormat } from '../../../constants';
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

  const notifySelfExclusionEdit = () => {
    postApi<RailsApiResponse<null>>(
      '/restapi/v1/user/log/self_exclusion_attempt',
    ).catch((err: RailsApiResponse<null>) => err);
  };

  return (
    <Accordion className="info-container info-container--gray mb-3">
      <div className="info-container__info pt-3">
        <div className="d-flex align-items-center">
          <p className="info-container__title pr-3">
            <b>{t(limitData.title)}</b>
          </p>
          {!limitData.disabled && (
            <Accordion.Toggle
              as="button"
              eventKey={limitData.id}
              onClick={() => {
                setActive(!active);
                if (limitData.id === 'self_exclusion' && !active) {
                  notifySelfExclusionEdit();
                }
              }}
              className={clsx(
                'info-container__edit btn btn-lg px-3 ml-auto',
                'btn-light',
              )}
            >
              {jsxT('timeout_edit')}
            </Accordion.Toggle>
          )}
        </div>
        {/* <p className="text-14 pt-1">{t(limitData.note)}</p> */}
      </div>
      <div className="info-container__text">
        <p className="text-gray-400 mb-0">
          {limitData.id === 'self_exclusion'
            ? disabledUntilDate && isSelfExcluded
              ? jsxT('player_disabled_indefinite')
              : jsxT('timeout_unset')
            : disabledUntilDate && !isSelfExcluded
            ? `${t('player_disabled_until')}: ${disabledUntilDate.format(
                franchiseDateFormat,
              )}`
            : jsxT('timeout_unset')}
        </p>
        {!limitData.disabled && (
          <Accordion.Collapse eventKey={limitData.id}>
            <>
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

const LimitsCard = ({ limitData, mutate }: LimitProps) => {
  const { t } = useI18n();
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
    <Accordion className="info-container mb-3">
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
                'info-container__edit btn btn-lg px-3 ml-auto',
                'btn-light',
              )}
            >
              {t('limits_edit')}
            </Accordion.Toggle>
          )}
        </div>
        <p className="text-14 pt-1">{t(limitData.note)}</p>
      </div>
      <div className="info-container__text">
        {!limitData.disabled && (
          <Accordion.Collapse eventKey={limitData.id}>
            <>
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
  const { t } = useI18n();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, mutate } = useApi<RailsApiResponse<LimitsHistoryData>>(
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
            <Spinner animation="border" className="spinner-custom mx-auto" />
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
                        <p className="heading-sm">{t('_date')}</p>
                        {dayjs(new Date(limit.CreatedAt)).format(
                          franchiseDateFormat,
                        )}
                      </td>
                      <td>
                        <p className="heading-sm">{t('save')}</p>
                        <p>
                          {t(limit.LimitTypeToString)}{' '}
                          {limit.LimitDurationToString &&
                            ` - ${t(limit.LimitDurationToString)}`}
                        </p>
                      </td>
                      <td>
                        <p className="heading-sm">{t('amount')}</p>
                        <div className="d-inline-flex align-items-center">
                          {timeLimits.includes(limit.LimitTypeToString) ? (
                            `${limit.Amount} ${t('hours')}`
                          ) : (
                            <NumberFormat
                              value={limit.Amount}
                              thousandSeparator
                              displayType={'text'}
                              prefix={user.currency}
                              decimalScale={2}
                              fixedDecimalScale={true}
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

const LimitsPage = () => {
  const { jsxT } = useI18n();
  const { data, error, mutate } = useApi<any>(
    '/restapi/v3/user/profile/play_limits',
  );
  const isDataLoading = !data && !error;
  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title">{jsxT('limits_page_title')}</h1>
      <div className="info-container mb-3">
        <div className="info-container__info pt-3">
          <p className="account-settings__sub-text">
            {jsxT('limits_page_sub_text')}
          </p>
        </div>
      </div>
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
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
    </main>
  );
};

export default LimitsPage;
