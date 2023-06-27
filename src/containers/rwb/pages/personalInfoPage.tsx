import React, { useMemo, useState } from 'react';
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
import { exists } from '../../../utils/reactUtils';
import Lockr from 'lockr';

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
  // console.log('blocks', blocks);
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
                'btn-light',
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
                fields={fields}
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
  const locations = Lockr.get('locations');
  const {
    data: personalInfo,
    error: personalErr,
    mutate: personalMutate,
  } = useApi<any>('/restapi/v4/user/profile/personal_info');

  //merge two fields to show one block container
  const mergedFields = personalInfo?.blocks[0].blocks.reduce((acc, curr) => {
    if (!acc.title) acc.title = curr.title;
    if (!acc.fields) acc.fields = [];
    acc.fields = [...acc.fields, ...curr.fields];
    acc.fields.forEach((val, i) => {
      if (val.id === 'submit_button') {
        acc.fields.splice(i, 1);
        acc.fields.push(val);
      }
    });
    return acc;
  }, {});
  const blocks = useMemo(() => {
    const userInfo = [
      {
        ...personalInfo?.blocks[0],
        mutate: personalMutate,
        error: personalErr,
      },
    ];
    if (mergedFields) userInfo[0].blocks = [mergedFields];
    console.log('userInfo', userInfo);
    return userInfo;
  }, [personalInfo, mergedFields]);

  const status = useMemo(() => {
    return {
      loading:
        !blocks.every(
          v =>
            ((!!v.fields || !!v.blocks) && !!v.data) ||
            v.id === 'email' ||
            v.id === 'playerId',
        ) && exists(locations),
      error: blocks.some(v => !!v.error),
    };
  }, [personalInfo]);
  console.log('blocks', blocks);
  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title">
        {jsxT('personal_info_page_title')}
      </h1>
      {status.loading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      )}
      {status.error && (
        <h2 className="mt-3 mb-5 text-center">
          {jsxT('settings_page_failed_to_load')}
        </h2>
      )}
      {!status.loading &&
        blocks.map((block, index) => (
          <PersonalInfoCard
            key={`${block.id}-${index}`}
            personalInfoData={block}
            mutate={block.mutate}
          />
        ))}
    </main>
  );
};

export default PersonalInfoPage;
