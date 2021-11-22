import React, { useState } from 'react';
import AccountPageTemplate from '../components/account-settings/AccountTemplate';
import useApi from '../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';
import CustomAlert from '../components/CustomAlert';
import SettingsForm from '../components/account-settings/SettingsForm';

const PersonalInfoPage = () => {
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/personal_info',
  );
  const isDataLoading = !data && !error;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const content = {
    title: 'My profile',
    text:
      'You have the option to modify your e-mail address and phone number.  For changes in your address and/or personal data, please contact our customer service.',
  };

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
      <div className="personal-info-container">
        {isDataLoading && (
          <div className="d-flex my-3">
            <Spinner animation="border" variant="white" />
          </div>
        )}
        {!!data && (
          <SettingsForm
            id={data.id}
            blocks={{
              items: data.blocks,
              className: 'personal-info-block',
              titleClassName: 'personal-info-block__title',
            }}
            action={data.action}
            setResponse={setApiResponse}
            mutateData={mutate}
          />
        )}
      </div>
    </AccountPageTemplate>
  );
};

export default PersonalInfoPage;
