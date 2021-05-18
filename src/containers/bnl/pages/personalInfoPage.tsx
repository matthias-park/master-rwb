import React, { useMemo, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../../hooks/useApi';
import SettingsForm from '../components/account-settings/SettingsForm';
import { SettingsField } from '../../../types/api/user/ProfileSettings';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import clsx from 'clsx';
import CustomAlert from '../components/CustomAlert';

interface PersonalInfoProps {
  personalInfoData: {
    id: string;
    title: string;
    note?: string;
    data: ({ value: string; symbol: boolean } | string)[];
    disabled: boolean;
    fields: SettingsField[];
    action: string;
  };
  mutate: () => void;
}

const PersonalInfoCard = ({ personalInfoData, mutate }: PersonalInfoProps) => {
  const { id, title, note, data, disabled, fields, action } = personalInfoData;
  const { t } = useI18n();
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  return (
    <Accordion className="info-container mb-3">
      <div className="info-container__info pt-3">
        <p className="mb-2">
          <b>{t(title)}</b>
        </p>
        {note && <p className="text-14 text-gray-700 pt-1">{t(note)}</p>}
        {!!fields && !disabled && (
          <Accordion.Toggle
            as="button"
            eventKey={id}
            className="info-container__edit btn btn-light btn-sm px-3"
          >
            {t('profile_edit')}
          </Accordion.Toggle>
        )}
      </div>
      <div className="info-container__text">
        {data.map((info, index) => {
          let text = '';
          if (typeof info === 'string') text = info;
          else if (Array.isArray(info))
            text = info
              .map(value => (value.symbol ? t(value.value) : value.value))
              .join(': ');

          return (
            <ul className="list-unstyled mb-0">
              {!index ? (
                <li className={clsx(index + 1 !== data.length && 'mb-1')}>
                  <b>{text}</b>
                </li>
              ) : (
                <li
                  className={clsx(
                    'text-gray-400',
                    index + 1 !== data.length && 'mb-1',
                  )}
                >
                  {text}
                </li>
              )}
            </ul>
          );
        })}
        {!!fields && !disabled && (
          <Accordion.Collapse eventKey={id}>
            <>
              <hr className="mt-2 mb-0"></hr>
              <CustomAlert
                show={!!apiResponse}
                variant={apiResponse?.success ? 'success' : 'danger'}
                className="mb-0 mt-2"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }}
                />
              </CustomAlert>
              <SettingsForm
                id={id}
                fields={fields}
                action={action}
                setResponse={setApiResponse}
                mutateData={mutate}
                fixedData={[{ id: 'phone_number' }, { id: 'postal_code' }]}
              />
            </>
          </Accordion.Collapse>
        )}
      </div>
    </Accordion>
  );
};

const PersonalInfoPage = () => {
  const { t } = useI18n();
  const { addToast } = useToasts();
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/personal_info',
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

  const questionItems = useMemo(
    () => [
      { title: t('deposit_question_1'), body: 'deposit_answer_1' },
      { title: t('deposit_question_2'), body: 'deposit_answer_2' },
    ],
    [t],
  );

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{t('personal_info_page_title')}</h1>
      <p className="mb-4">{t('personal_info_page_sub_text')}</p>
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
      {!!data &&
        data.blocks.map(block => (
          <PersonalInfoCard personalInfoData={block} mutate={mutate} />
        ))}
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['phone']}
        className={'d-block d-xl-none'}
      />
    </main>
  );
};

export default PersonalInfoPage;
