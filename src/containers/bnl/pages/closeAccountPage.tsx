import React, { useMemo, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import useApi from '../../../hooks/useApi';
import SettingsForm from '../components/account-settings/SettingsForm';
import { SettingsField } from '../../../types/api/user/ProfileSettings';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import CustomAlert from '../components/CustomAlert';

interface CloseAccountProps {
  closeAccountData: {
    id: string;
    title: string;
    note: string;
    fields: SettingsField[];
    action: string;
  };
}

const CloseAccountCard = ({ closeAccountData }: CloseAccountProps) => {
  const { t } = useI18n();
  const { id, title, note, fields, action } = closeAccountData;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  return (
    <Accordion className="info-container info-container--gray mb-3">
      <div className="info-container__info pt-3">
        <p className="mb-2">
          <b>{t(title)}</b>
        </p>
        <p className="text-14 text-gray-700 pt-1">{t(note)}</p>
        <Accordion.Toggle
          as="button"
          eventKey={id}
          className="info-container__edit btn btn-light btn-sm px-3"
        >
          {t('close_account_edit')}
        </Accordion.Toggle>
      </div>
      <div className="info-container__text py-3">
        <p className="text-gray-600 mb-0">{t('close_account_unset')}</p>
        <Accordion.Collapse eventKey={id}>
          <>
            <hr className="pt-1 mb-0"></hr>
            <CustomAlert
              show={!!apiResponse}
              variant={
                (apiResponse && (apiResponse.success ? 'success' : 'danger')) ||
                ''
              }
              className="mb-0 mt-2"
            >
              <div
                dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }}
              />
            </CustomAlert>
            <SettingsForm
              id={id}
              fields={fields}
              action={action}
              setResponse={setApiResponse}
            />
          </>
        </Accordion.Collapse>
      </div>
    </Accordion>
  );
};

const CloseAccountPage = () => {
  const { t } = useI18n();
  const { data, error } = useApi<any>(
    '/railsapi/v1/user/profile/close_account',
  );
  const isDataLoading = !data && !error;
  const questionItems = useMemo(
    () => [
      {
        title: t('close_account_question_1'),
        body: t('close_account_answer_1'),
      },
      {
        title: t('close_account_question_2'),
        body: t('close_account_answer_2'),
      },
    ],
    [t],
  );

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{t('close_account_page_title')}</h1>
      <p className="mb-4">{t('close_account_sub_text')}</p>
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
            <CloseAccountCard key={item.id} closeAccountData={item} />
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
