import React, { useMemo, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import Spinner from 'react-bootstrap/Spinner';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../../hooks/useApi';
import SettingsForm from '../components/account-settings/SettingsForm';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import CustomAlert from '../components/CustomAlert';

const ChangePasswordPage = () => {
  const { t } = useI18n();
  const { addToast } = useToasts();
  const { data, error } = useApi<any>(
    '/railsapi/v1/user/profile/change_password',
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
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
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
      <h1>{t('change_password_page_title')}</h1>
      <p className="mb-4">{t('change_password_sub_text')}</p>
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {!!data && (
        <div className="change-pw">
          <CustomAlert
            show={!!apiResponse}
            variant={apiResponse?.success ? 'success' : 'danger'}
          >
            <div dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }} />
          </CustomAlert>
          <p className="change-pw__title">{data.title}</p>
          <SettingsForm
            id={data.id}
            fields={data.fields}
            action={data.action}
            setResponse={setApiResponse}
          />
        </div>
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

export default ChangePasswordPage;