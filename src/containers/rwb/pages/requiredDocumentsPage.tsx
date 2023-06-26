import React, { useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import useApi from '../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';
import SettingsForm from '../components/account-settings/SettingsForm';
import CustomAlert from '../components/CustomAlert';
import RequiredDocuments from '../../../types/api/DocumentPage';

interface RequiredDocumentsProps {
  data: RequiredDocuments;
  error: any;
  mutate: () => void;
  isDataLoading: boolean;
  title: string;
}

const RequiredDocumentsComponent = (props: RequiredDocumentsProps) => {
  const { data, error, mutate, isDataLoading, title } = props;
  const { t, jsxT } = useI18n();
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  return (
    <div className="outer-info-block pt-3 pb-4 mt-4">
      {!!error && (
        <h2 className="mt-3 mb-5 text-center">
          {jsxT('settings_page_failed_to_load')}
        </h2>
      )}
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
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
          <h6 className="mt-2 mb-0 required-document-block__title">
            {t(title)}
          </h6>
          <p className="mb-3 required-document-block__title__example">
            {t(title + '__example')}
          </p>
          <SettingsForm
            id={data.id + title}
            fields={data.fields.map(field => {
              field.id = field.id === 'image_valid_id' ? 'image_id' : field.id;
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
  );
};

const RequiredDocumentsPage = () => {
  const { jsxT } = useI18n();
  const { data, error, mutate } = useApi<RequiredDocuments>(
    '/restapi/v1/user/profile/required_documents',
  );
  const isDataLoading = !data && !error;
  const documentComponents = [
    ['image_id', 'image_id_sub_type', 'password', 'submit_button'],
    ['image_residence', 'submit_button'],
    ['image_payment_proof', 'submit_button'],
  ];

  const filterFields = (
    data: RequiredDocuments,
    filteringArray: string[],
  ): RequiredDocuments => {
    const filteredFields = data.fields.filter(field =>
      filteringArray.includes(field.id),
    );
    return { ...data, fields: filteredFields };
  };
  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title">
        {jsxT('required_documents_page_title')}
      </h1>
      {!!data &&
        documentComponents.map(component => {
          return (
            <RequiredDocumentsComponent
              data={filterFields(data, component)}
              error={error}
              mutate={mutate}
              isDataLoading={isDataLoading}
              title={component[0] + '__title'}
            />
          );
        })}
    </main>
  );
};

export default RequiredDocumentsPage;
