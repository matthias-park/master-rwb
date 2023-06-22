import React, { useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import useApi from '../../../hooks/useApi';
import SettingsForm from '../components/account-settings/SettingsForm';
import clsx from 'clsx';
import CustomAlert from '../components/CustomAlert';
import { useDispatch } from 'react-redux';
import { setValidationStatus } from '../../../state/reducers/user';
import { KYC_VALIDATOR_STATUS } from '../../../types/UserStatus';
import { useAuth } from '../../../hooks/useAuth';

interface PersonalInfoProps {
  personalInfoData: any;
  mutate: () => void;
}

const PersonalInfoCard = ({ personalInfoData, mutate }: PersonalInfoProps) => {
  const { user } = useAuth();
  const { id, title, note, fields, action, blocks } = personalInfoData;
  const dispatch = useDispatch();
  const { t } = useI18n();
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  return (
    <Accordion className="info-container mb-3" defaultActiveKey={id}>
      <div className="info-container__info pt-3">
        <div className="d-flex align-items-center">
          <p className="info-container__title">
            <b>{t(title)}</b>
          </p>
          {note && <p className="text-14 text-gray-700 pt-1">{t(note)}</p>}
          {(!!fields || !!blocks) && (
            <Accordion.Toggle
              as="button"
              eventKey={id}
              className={clsx(
                'info-container__edit btn btn-sm px-3 ml-auto',
                window.__config__.name === 'strive'
                  ? 'btn-light'
                  : 'btn-secondary',
              )}
            >
              {t('profile_edit')}
            </Accordion.Toggle>
          )}
        </div>
      </div>
      <div className="info-container__text">
        {(!!fields || !!blocks) && (
          <Accordion.Collapse eventKey={id}>
            <>
              <hr className="mt-2 mb-0"></hr>
              <CustomAlert
                show={!!apiResponse}
                variant={
                  (apiResponse &&
                    (apiResponse.success ? 'success' : 'danger')) ||
                  ''
                }
                className="mb-0 mt-2"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }}
                />
              </CustomAlert>
              <SettingsForm
                id={id}
                fields={undefined}
                blocks={
                  blocks && {
                    items: blocks,
                    className: 'personal-info-block',
                    titleClassName: 'personal-info-block__title',
                  }
                }
                action={action}
                setResponse={resp => {
                  if (resp?.success) {
                    dispatch(setValidationStatus(KYC_VALIDATOR_STATUS.Unknown));
                  }
                  setApiResponse(resp);
                }}
                mutateData={mutate}
                fixedData={[{ id: 'phone_number' }]}
                formDisabled={
                  user.validator_status !==
                  KYC_VALIDATOR_STATUS.ShouldUpdatePersonalDataLimitedAttempts
                }
              />
            </>
          </Accordion.Collapse>
        )}
      </div>
    </Accordion>
  );
};

const PersonalInfoPage = () => {
  const { jsxT } = useI18n();
  const { data, error, mutate } = useApi<any>(
    '/restapi/v4/user/profile/personal_info',
  );
  const isDataLoading = !data && !error;

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title">
        {jsxT('personal_info_page_title')}
      </h1>
      <p className="account-settings__sub-text">
        {jsxT('personal_info_page_sub_text')}
      </p>
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      )}
      {!!error && (
        <h2 className="mt-3 mb-5 text-center">
          {jsxT('settings_page_failed_to_load')}
        </h2>
      )}
      {!!data &&
        data.blocks.map((block, index) => (
          <PersonalInfoCard
            key={index}
            personalInfoData={block}
            mutate={mutate}
          />
        ))}
    </main>
  );
};

export default PersonalInfoPage;
