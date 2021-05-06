import React, { useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../hooks/useApi';
import SettingsForm from '../../components/account-settings/SettingsForm';
import { SettingsField } from '../../types/api/user/ProfileSettings';
import QuestionsContainer from '../../components/account-settings/QuestionsContainer';
import HelpBlock from '../../components/HelpBlock';

interface CloseAccountProps {
  id: string;
  title: string;
  subText: string;
  fields: SettingsField[];
  action: string;
  current: string;
}

const CloseAccountCard = ({
  id,
  title,
  subText,
  fields,
  action,
  current,
}: CloseAccountProps) => {
  const { t, jsxT } = useI18n();

  return (
    <Accordion className="info-container info-container--gray mb-3">
      <div className="info-container__info pt-3">
        <p className="mb-2">
          <b>{title}</b>
        </p>
        <p className="text-14 text-gray-700 pt-1">{subText}</p>
        <Accordion.Toggle
          as="button"
          eventKey={id}
          className="info-container__edit btn btn-light btn-sm px-3"
        >
          Annuleer
        </Accordion.Toggle>
      </div>
      <div className="info-container__text py-3">
        <p className="text-gray-600 mb-0">{current}</p>
        <Accordion.Collapse eventKey={id}>
          <SettingsForm id={id} fields={fields} action={action} />
        </Accordion.Collapse>
      </div>
    </Accordion>
  );
};

const CloseAccountPage = () => {
  const { t, jsxT } = useI18n();
  const { addToast } = useToasts();
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/close_account',
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
      <h1>{t('close_account_page_title')}</h1>
      <p className="mb-4">{t('close_account_sub_text')}</p>
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
          {new Array(data).map(item => (
            <CloseAccountCard
              key={data.id}
              id={data.id}
              title={data.title}
              subText={data.note}
              fields={data.fields}
              action={data.action}
              current="Geen permanente uitsluiting ingeschakeld"
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

export default CloseAccountPage;
