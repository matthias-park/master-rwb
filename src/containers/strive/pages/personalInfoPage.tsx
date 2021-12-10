import React, { useMemo, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import useApi from '../../../hooks/useApi';
import SettingsForm from '../components/account-settings/SettingsForm';
import { SettingsField } from '../../../types/api/user/ProfileSettings';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import clsx from 'clsx';
import CustomAlert from '../components/CustomAlert';
import { useDispatch } from 'react-redux';
import { setValidationStatus } from '../../../state/reducers/user';
import { KYC_VALIDATOR_STATUS } from '../../../types/UserStatus';

interface PersonalInfoProps {
  personalInfoData: any;
  mutate: () => void;
}

const PersonalInfoCard = ({ personalInfoData, mutate }: PersonalInfoProps) => {
  const {
    id,
    title,
    note,
    data,
    disabled,
    fields,
    action,
    blocks,
  } = personalInfoData;
  const dispatch = useDispatch();
  const { t } = useI18n();
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  return (
    <Accordion className="info-container mb-3">
      <div className="info-container__info pt-3">
        <div className="d-flex align-items-center">
          <p className="info-container__title">
            <b>{t(title)}</b>
          </p>
          {note && <p className="text-14 text-gray-700 pt-1">{t(note)}</p>}
          {(!!fields || !!blocks) && !disabled && (
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
        {data?.map((info, index) => {
          let text = '';
          if (typeof info === 'string') text = info;
          else if (Array.isArray(info))
            text = info
              .map(value => (value.symbol ? t(value.value) : value.value))
              .join(': ');
          if (id === 'bank_account')
            text = text.match(/.{1,4}/g)?.join(' ') || text;

          return (
            <ul key={index} className="list-unstyled mb-0">
              {!index ? (
                <li className={clsx(index + 1 !== data.length && 'mb-1')}>
                  <b className="info-container__text-bold">{text}</b>
                </li>
              ) : (
                <li className={clsx(index + 1 !== data.length && 'mb-1')}>
                  {text}
                </li>
              )}
            </ul>
          );
        })}
        {(!!fields || !!blocks) && !disabled && (
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
              />
            </>
          </Accordion.Collapse>
        )}
      </div>
    </Accordion>
  );
};

const PersonalInfoPage = () => {
  const { t, jsxT } = useI18n();
  const { data, error, mutate } = useApi<any>(
    '/restapi/v1/user/profile/personal_info',
  );
  const isDataLoading = !data && !error;

  const questionItems = useMemo(
    () => [
      { title: t('profile_question_1'), body: t('profile_answer_1') },
      { title: t('profile_question_2'), body: t('profile_answer_2') },
    ],
    [t],
  );

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
          <Spinner animation="border" variant="black" className="mx-auto" />
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
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['faq', 'phone', 'email']}
        className="d-block d-xl-none"
      />
    </main>
  );
};

export default PersonalInfoPage;
