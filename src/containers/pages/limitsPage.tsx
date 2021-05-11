import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import CustomAlert from '../../components/CustomAlert';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../hooks/useApi';
import SettingsForm from '../../components/account-settings/SettingsForm';
import { SettingsField } from '../../types/api/user/ProfileSettings';
import QuestionsContainer from '../../components/account-settings/QuestionsContainer';
import HelpBlock from '../../components/HelpBlock';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';

interface LimitProps {
  limitData: {
    id: string;
    title: string;
    note: string;
    limit_amount: number;
    amount_left: number;
    future_limit_amount: number;
    future_limit_valid_from: string;
    fields: SettingsField[];
    action: string;
  };
  mutate: () => void;
}

const LimitsCard = ({ limitData, mutate }: LimitProps) => {
  const { t, jsxT } = useI18n();
  const { user } = useAuth();
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  useEffect(() => {
    apiResponse?.success && mutate();
  }, [apiResponse]);

  return (
    <Accordion className="info-container mb-3">
      <div className="info-container__info pt-3">
        <p className="mb-2">
          <b>{limitData.title}</b>
        </p>
        <p className="text-14 text-gray-700 pt-1">{limitData.note}</p>
        <Accordion.Toggle
          as="button"
          eventKey={limitData.id}
          className="info-container__edit btn btn-light btn-sm px-3"
        >
          {t('limits_edit')}
        </Accordion.Toggle>
      </div>
      <div className="info-container__text">
        {limitData.limit_amount ? (
          <ul className="list-unstyled mb-0 play-limits">
            <li className="play-limits__limit">
              <p className="play-limits__limit-title">{t('current_limit')}</p>
              <p className="play-limits__limit-total text-primary">
                {user.currency} {limitData.limit_amount}
              </p>
            </li>
            <li className="play-limits__limit">
              <p className="play-limits__limit-title">{t('used_limit')}</p>
              <p className="play-limits__limit-total">
                {user.currency} {limitData.limit_amount - limitData.amount_left}
              </p>
            </li>
            <li className="play-limits__limit">
              <p className="play-limits__limit-title">{t('left_limit')}</p>
              <p className="play-limits__limit-total">
                {user.currency} {limitData.amount_left}
              </p>
            </li>
          </ul>
        ) : (
          <p className="text-gray-400 mb-0">{t('limit_unset')}</p>
        )}
        {limitData.future_limit_amount && limitData.future_limit_valid_from && (
          <>
            <hr className="mt-2 mb-3"></hr>
            <p className="text-14 text-gray-800 mb-2">
              <b>{t('future_limit_title')}</b>
            </p>
            <p className="text-14 text-gray-400 mb-2">
              {t('future_limit_amount')}:&nbsp;
              <b className="text-gray-800">
                {user.currency} {limitData.future_limit_amount}
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
        <Accordion.Collapse eventKey={limitData.id}>
          <>
            <hr className="pt-1 mb-0"></hr>
            <CustomAlert
              show={!!apiResponse}
              variant={apiResponse?.success ? 'success' : 'danger'}
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
            />
          </>
        </Accordion.Collapse>
      </div>
    </Accordion>
  );
};

const LimitsPage = () => {
  const { t, jsxT } = useI18n();
  const { addToast } = useToasts();
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/play_limits',
    {
      onErrorRetry: (error, key) => {
        addToast(`Failed to fetch user settings`, {
          appearance: 'error',
          autoDismiss: true,
        });
        console.log(error);
      },
    },
  );
  const isDataLoading = !data && !error;

  const questionItems = useMemo(
    () => [
      { title: t('deposit_question_1'), body: 'deposit_answer_1' },
      { title: t('deposit_question_2'), body: 'deposit_answer_2' },
    ],
    [t],
  );

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{t('limits_page_title')}</h1>
      <p className="mb-4">{t('limits_page_sub_text')}</p>
      <div className="play-responsible-block mb-3">
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
          {t('settings_page_failed_to_load')}
        </h2>
      )}
      {!!data && (
        <>
          {Object.keys(data).map(limit => (
            <LimitsCard
              key={data[limit].id}
              limitData={data[limit]}
              mutate={mutate}
            />
          ))}
        </>
      )}
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['phone']}
        className={'d-block d-xl-none'}
      />
    </main>
  );
};

export default LimitsPage;
