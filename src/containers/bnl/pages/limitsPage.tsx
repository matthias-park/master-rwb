import React, { useState, useMemo } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import CustomAlert from '../components/CustomAlert';
import useApi from '../../../hooks/useApi';
import SettingsForm from '../components/account-settings/SettingsForm';
import { SettingsField } from '../../../types/api/user/ProfileSettings';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import { useAuth } from '../../../hooks/useAuth';
import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';

interface LimitProps {
  limitData: {
    id: string;
    title: string;
    note: string;
    limit_amount?: number;
    amount_left?: number;
    future_limit_amount?: number;
    future_limit_valid_from?: string;
    fields: SettingsField[];
    action: string;
    disabled?: boolean;
  };
  mutate: () => void;
}

const timeoutCards = ['disable_player_time_out', 'self_exclusion'];

const TimeoutCard = ({ limitData, mutate }: LimitProps) => {
  const { t, jsxT } = useI18n();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    <Accordion className="info-container info-container--gray mb-3">
      <div className="info-container__info pt-3">
        <div className="d-flex">
          <p className="mb-2 pr-3">
            <b>{t(limitData.title)}</b>
          </p>
          {!limitData.disabled && (
            <Accordion.Toggle
              as="button"
              onClick={() => setIsOpen(!isOpen)}
              eventKey={limitData.id}
              className="info-container__edit btn btn-light btn-sm px-3 ml-auto"
            >
              {isOpen ? t('cancel') : t('timeout_edit')}
            </Accordion.Toggle>
          )}
        </div>
        <p className="text-14 text-gray-700 pt-1">{t(limitData.note)}</p>
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
              <hr className="pt-1 mb-0"></hr>
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
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
        <div className="d-flex">
          <p className="mb-2 pr-3">
            <b>{t(limitData.title)}</b>
          </p>
          {!limitData.disabled && (
            <Accordion.Toggle
              as="button"
              onClick={() => setIsOpen(!isOpen)}
              eventKey={limitData.id}
              className="info-container__edit btn btn-light btn-sm px-3 ml-auto"
            >
              {isOpen ? t('cancel') : t('limits_edit')}
            </Accordion.Toggle>
          )}
        </div>
        <p className="text-14 text-gray-700 pt-1">{t(limitData.note)}</p>
      </div>
      <div className="info-container__text">
        {limitData.limit_amount != null ? (
          <ul className="list-unstyled mb-0 play-limits">
            <li className="play-limits__limit">
              <p className="play-limits__limit-title">{t('current_limit')}</p>
              <p className="play-limits__limit-total text-primary">
                <NumberFormat
                  value={limitData.limit_amount}
                  displayType={'text'}
                  thousandSeparator=" "
                  decimalSeparator=","
                  prefix={user.currency}
                />
              </p>
            </li>
            <li className="play-limits__limit">
              <p className="play-limits__limit-title">{t('used_limit')}</p>
              <p className="play-limits__limit-total">
                {limitData.limit_amount != null &&
                limitData.amount_left != null ? (
                  <NumberFormat
                    value={Number(
                      (limitData.limit_amount - limitData.amount_left).toFixed(
                        2,
                      ),
                    )}
                    displayType={'text'}
                    thousandSeparator=" "
                    decimalSeparator=","
                    prefix={user.currency}
                  />
                ) : (
                  '0'
                )}
              </p>
            </li>
            <li className="play-limits__limit">
              <p className="play-limits__limit-title">{t('left_limit')}</p>
              <p className="play-limits__limit-total">
                <NumberFormat
                  value={limitData?.amount_left ?? limitData.limit_amount}
                  displayType={'text'}
                  thousandSeparator=" "
                  decimalSeparator=","
                  prefix={user.currency}
                />
              </p>
            </li>
          </ul>
        ) : (
          <p className="text-gray-400 mb-0">{t('limit_unset')}</p>
        )}
        {!!limitData.future_limit_amount &&
          !!limitData.future_limit_valid_from && (
            <>
              <hr className="mt-2 mb-3"></hr>
              <p className="text-14 text-gray-800 mb-2">
                <b>{t('future_limit_title')}</b>
              </p>
              <p className="text-14 text-gray-400 mb-2">
                {t('future_limit_amount')}:&nbsp;
                <b className="text-gray-800">
                  <NumberFormat
                    value={limitData.future_limit_amount}
                    displayType={'text'}
                    thousandSeparator=" "
                    decimalSeparator=","
                    prefix={user.currency}
                  />
                </b>
              </p>
              <p className="text-14 text-gray-400 mb-0">
                {t('future_limit_valid_from')}:&nbsp;
                <b className="text-gray-800">
                  {dayjs(new Date(limitData.future_limit_valid_from)).format(
                    'YYYY-MM-DD',
                  )}
                </b>
              </p>
            </>
          )}
        {!limitData.disabled && (
          <Accordion.Collapse eventKey={limitData.id}>
            <>
              <hr className="pt-1 mb-0"></hr>
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

const LimitsPage = () => {
  const { t, jsxT } = useI18n();
  const { data, error, mutate } = useApi<any>(
    '/restapi/v1/user/profile/play_limits',
  );
  const isDataLoading = !data && !error;

  const questionItems = useMemo(
    () => [
      { title: t('limits_question_1'), body: t('limits_answer_1') },
      { title: t('limits_question_2'), body: t('limits_answer_2') },
    ],
    [t],
  );

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{jsxT('limits_page_title')}</h1>
      <p className="mb-4">{jsxT('limits_page_sub_text')}</p>
      <div className="play-responsible-block mb-3 px-2">
        <i className="icon-thumbs"></i>
        {jsxT('play_responsible_block_link')}
      </div>
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
