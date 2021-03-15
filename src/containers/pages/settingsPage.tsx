import React from 'react';
import loadable from '@loadable/component';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import ProfileSettings from '../../types/api/user/ProfileSettings';
import { postApi } from '../../utils/apiUtils';
import DynamicSettingsAccordion from '../../components/account-settings/DynamicSettingsAccordion';
import { useI18n } from '../../hooks/useI18n';
import { useToasts } from 'react-toast-notifications';
import { useConfig } from '../../hooks/useConfig';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useApi from '../../hooks/useApi';
import { isEqual } from 'lodash';

const LoadableMarketingSettingsAccordion = loadable(
  () => import('../../components/account-settings/MarketingSettingsAccordion'),
);
const LoadableRequiredDocumentsAccordion = loadable(
  () => import('../../components/account-settings/RequiredDocumentsAccordion'),
);

export const COMPONENTS_BY_SETTINGS = {
  gdpr_settings: LoadableMarketingSettingsAccordion,
  documents: LoadableRequiredDocumentsAccordion,
};

const SettingsPage = () => {
  const { t } = useI18n();
  const { user, mutateUser } = useConfig((prev, next) =>
    isEqual(prev.user, next.user),
  );
  const { addToast } = useToasts();
  const { data, error, mutate } = useApi<ProfileSettings>(
    '/railsapi/v1/user/profile',
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
  const handleOnSubmit = async (
    url: string,
    body: { [key: string]: string | Blob },
    formBody: boolean = false,
    updateUser: boolean = false,
  ): Promise<void> => {
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
    addToast(res.Message, {
      appearance: res.Success ? 'success' : 'error',
      autoDismiss: true,
    });
    setTimeout(() => mutate(), 1000);
    if (updateUser) {
      mutateUser();
    }
    return;
  };
  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="mb-4">{t('settings_page_title')}</h1>
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
      {!!data?.forms && (
        <Accordion>
          {data.forms.map((form, index) => {
            const Component =
              COMPONENTS_BY_SETTINGS[form.id] || DynamicSettingsAccordion;
            if (!Component) return null;
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
    </main>
  );
};

export default SettingsPage;
