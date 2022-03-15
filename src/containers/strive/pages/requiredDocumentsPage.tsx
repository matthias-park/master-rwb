import React, { useMemo, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import useApi from '../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';
import SettingsForm from '../components/account-settings/SettingsForm';
import CustomAlert from '../components/CustomAlert';

const questionItems = [
  { title: 'documents_question_1', body: 'documents_answer_1' },
  { title: 'documents_question_2', body: 'documents_answer_2' },
];

const RequiredDocumentsPage = () => {
  const { t, jsxT } = useI18n();
  const { data, error, mutate } = useApi<any>(
    '/restapi/v1/user/profile/required_documents',
  );
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const isDataLoading = !data && !error;

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title">
        {jsxT('required_documents_page_title')}
      </h1>
      <div className="outer-info-block pt-3 pb-4 mt-4">
        {!!error && (
          <h2 className="mt-3 mb-5 text-center">
            {jsxT('settings_page_failed_to_load')}
          </h2>
        )}
        {isDataLoading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="black" className="mx-auto" />
          </div>
        )}
        <CustomAlert
          show={!!apiResponse}
          variant={
            (apiResponse && (apiResponse.success ? 'success' : 'danger')) || ''
          }
          className="my-3"
        >
          <div dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }} />
        </CustomAlert>
        {!!data && (
          <>
            <h6 className="mt-2 mb-0">{t(data.title)}</h6>
            <SettingsForm
              id={data.id}
              fields={data.fields.map(field => {
                field.id =
                  field.id === 'image_valid_id' ? 'image_id' : field.id;
                return field;
              })}
              action={data.action}
              setResponse={setApiResponse}
              mutateData={mutate}
              formBody={true}
              allowSubmit={fields => {
                const fileUploaded = Object.entries(fields)
                  .filter(
                    ([field]) =>
                      !['password', 'image_id_sub_type'].includes(field),
                  )
                  .some(([_, value]) => !!value);
                const idTypeSelected = fields.image_id
                  ? (fields.image_id_sub_type || '-1') !== '-1'
                  : true;
                const passwordRequired = data.fields.some(
                  field => field.id === 'password' && !field.disabled,
                );
                const passwordEntered = !!fields.password || !passwordRequired;
                return fileUploaded && idTypeSelected && passwordEntered;
              }}
            />
          </>
        )}
      </div>
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['faq', 'phone', 'email']}
        className="d-block d-xl-none"
      />
    </main>
  );
};

export default RequiredDocumentsPage;
