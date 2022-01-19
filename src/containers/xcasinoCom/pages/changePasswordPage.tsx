import React, { useState } from 'react';
import useApi from '../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';
import AccountPageTemplate from '../components/account-settings/AccountTemplate';
import CustomAlert from '../components/CustomAlert';
import SettingsForm from '../components/account-settings/SettingsForm';

const ChangePasswordPage = () => {
  const { data, error } = useApi<any>(
    '/restapi/v1/user/profile/change_password',
  );
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const isDataLoading = !data && !error;

  const content = {
    title: 'Change Password',
    text:
      'For your own safety, we recommend that you change your password on a regular basis. Simply fill in the following fields. For security reasons, we will send you an e-mail to confirm the change of your password.',
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
      <div className="change-password-container">
        <div className="change-password-block">
          <h6 className="change-password-block__title">
            Lucky Account Password
          </h6>
          {isDataLoading && (
            <div className="d-flex my-3">
              <Spinner animation="border" variant="white" />
            </div>
          )}
          {!!data && (
            <SettingsForm
              id={data.id}
              fields={data.fields}
              action={data.action}
              setResponse={setApiResponse}
            />
          )}
        </div>
      </div>
    </AccountPageTemplate>
  );
};

export default ChangePasswordPage;
