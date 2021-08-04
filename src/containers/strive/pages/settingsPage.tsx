import React, { useState } from 'react';
import loadable from '@loadable/component';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import ProfileSettings from '../../../types/api/user/ProfileSettings';
import HelpBlock from '../components/HelpBlock';
import { postApi } from '../../../utils/apiUtils';
import DynamicSettingsAccordion from '../components/account-settings/DynamicSettingsAccordion';
import { useI18n } from '../../../hooks/useI18n';
import { useToasts } from 'react-toast-notifications';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import CustomAlert from '../components/CustomAlert';
import { useAuth } from '../../../hooks/useAuth';

const LoadableMarketingSettingsAccordion = loadable(
  () => import('../components/account-settings/MarketingSettingsAccordion'),
);
const LoadableRequiredDocumentsAccordion = loadable(
  () => import('../components/account-settings/RequiredDocumentsAccordion'),
);

export const COMPONENTS_BY_SETTINGS = {
  gdpr_settings: LoadableMarketingSettingsAccordion,
  documents: LoadableRequiredDocumentsAccordion,
};

const SettingsPage = () => {
  const { t, jsxT } = useI18n();
  const { user, updateUser } = useAuth();
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const { addToast } = useToasts();
  const { data, error, mutate } = useApi<ProfileSettings>(
    '/railsapi/v1/user/profile',
  );
  const isDataLoading = !data && !error;
  const handleOnSubmit = async (
    url: string,
    body: { [key: string]: string | Blob },
    formBody: boolean = false,
    shouldUpdateUser: boolean = false,
  ): Promise<void> => {
    setApiResponse(null);
    body.authenticity_token = user.token!;
    const res = await postApi<RailsApiResponse<null>>(url, body, {
      formData: formBody,
    }).catch((res: RailsApiResponse<null>) => {
      if (res.Fallback) {
        addToast(`Failed to update user settings`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      return res;
    });
    setApiResponse({
      success: res.Success,
      msg: res.Message || t('api_response_failed'),
    });
    setTimeout(() => mutate(), 1000);
    if (shouldUpdateUser) {
      updateUser();
    }
    return;
  };
  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="mb-4">{jsxT('settings_page_title')}</h1>
      <CustomAlert
        show={!!apiResponse}
        variant={apiResponse?.success ? 'success' : 'danger'}
      >
        <div dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }} />
      </CustomAlert>
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
      {!!data?.forms && (
        <Accordion>
          {data.forms.map((form, index) => {
            const Component =
              COMPONENTS_BY_SETTINGS[form.id] || DynamicSettingsAccordion;
            if (!Component || !form.fields) return null;
            return (
              <Component
                key={form.id}
                form={form}
                order={index}
                onSubmit={handleOnSubmit}
              />
            );
          })}
        </Accordion>
      )}
      <HelpBlock
        title={'user_help_title'}
        blocks={['phone']}
        className={'d-block d-xl-none mt-4'}
      />
    </main>
  );
};

export default SettingsPage;
