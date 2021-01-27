import React from 'react';
import useSWR from 'swr';
import loadable from '@loadable/component';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import ProfileSettings from '../../types/api/user/ProfileSettings';
import { postApi } from '../../utils/apiUtils';
import DynamicSettingsAccordion from '../../components/account-settings/DynamicSettingsAccordion';
import { useI18n } from '../../hooks/useI18n';
import { useToasts } from 'react-toast-notifications';
import { useConfig } from '../../hooks/useConfig';
import { UpdateSettingResponse } from '../../types/api/user/ProfileSettings';

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
  const { user } = useConfig();
  const { addToast } = useToasts();
  const { data, error, mutate } = useSWR<ProfileSettings>('/v2/profile.json', {
    onErrorRetry: (error, key) => {
      addToast(`Failed to fetch user settings`, {
        appearance: 'error',
        autoDismiss: true,
      });
      console.log(error);
    },
  });
  const isDataLoading = !data && !error;
  const handleOnSubmit = async (
    url: string,
    body: { [key: string]: string | Blob },
    formBody: boolean = false,
  ) => {
    body.authenticity_token = user.token!;
    const res = await postApi<UpdateSettingResponse>(
      `${url}?response_json=true`,
      body,
      { formData: formBody },
    ).catch(() => ({ success: false, status: 'failure', message: '' }));
    if (res.success || res.status === 'success') {
      if (res.message) {
        addToast(res.message, {
          appearance: 'success',
          autoDismiss: true,
        });
      }
      mutate();
    } else {
      addToast(`Failed to update user settings`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };
  return (
    <main className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4">
      <h1 className="mb-4">{t('settings_page_title')}</h1>
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
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
