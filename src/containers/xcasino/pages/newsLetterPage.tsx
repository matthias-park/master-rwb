import React, { useState } from 'react';
import AccountPageTemplate from '../components/account-settings/AccountTemplate';
import useApi from '../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';
import CustomAlert from '../components/CustomAlert';
import SettingsForm from '../components/account-settings/SettingsForm';

const NewsLetterPage = () => {
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/communication_preferences',
  );
  const isDataLoading = !data && !error;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const content = {
    title: 'News Letter',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Donec ullamcorper nulla.  ',
  };

  const formatBody = data => {
    const body = {
      gdpr_config: {
        ...data,
      },
    };
    return body;
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
      <div className="news-letter-container">
        <div className="news-letter-block">
          <h6 className="news-letter-block__title">
            Stay updated with out special offers
          </h6>
          {isDataLoading && (
            <div className="d-flex my-3">
              <Spinner animation="border" variant="white" />
            </div>
          )}
          {!!data && (
            <div className="w-75">
              <SettingsForm
                id={data.id}
                fields={data.fields}
                action={data.action}
                setResponse={setApiResponse}
                formatRequestBody={formatBody}
                mutateData={mutate}
              />
            </div>
          )}
        </div>
      </div>
    </AccountPageTemplate>
  );
};

export default NewsLetterPage;
