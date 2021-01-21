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
  const { addToast } = useToasts();
  const { data, error } = useSWR<ProfileSettings>('/v2/profile.json', {
    onErrorRetry: (error, key) => {
      addToast(`Failed to fetch user settings`, {
        appearance: 'error',
        autoDismiss: true,
      });
      console.log(error);
    },
  });
  const isDataLoading = !data && !error;
  const handleOnSubmit = async (url: string, body: unknown) => {
    const rez = await postApi(url, body).catch(() => {
      addToast(`Failed to update user settings`, {
        appearance: 'error',
        autoDismiss: true,
      });
    });
    console.log(url, body, rez);
  };
  // console.log(data);
  return (
    <div className="container-fluid px-0 px-sm-4 mb-4">
      <h2 className="mb-4">{t('settings_page_title')}</h2>
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="white" className="mx-auto" />
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
    </div>
  );
};

export default SettingsPage;
