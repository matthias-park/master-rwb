import React, { useState, useCallback, useEffect } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import CustomToggleCheck from '../components/CustomToggleCheck';
import Spinner from 'react-bootstrap/Spinner';
import useApi from '../../../hooks/useApi';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import CustomAlert from '../components/CustomAlert';
import { useForm } from 'react-hook-form';
import LoadingButton from '../../../components/LoadingButton';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { postApi } from '../../../utils/apiUtils';
import { ComponentSettings } from '../../../constants';

interface CommunicationPrefProps {
  title: string;
  subText: string;
  fields:
    | {
        [key in string]: boolean;
      }
    | {
        id: string;
        title: string;
        type: string;
        default: number;
      }[];
  setValues: (number) => void;
  values: {
    [key: string]: number;
  };
  registerField: any;
  mobilePref: boolean;
}

const mobilePreferences = {
  push_notifications: 'comm_pref_push_note_message',
  email_marketing: 'comm_pref_email_message',
  bets_notifications: 'comm_pref_bets_message',
  winning_notifications: 'comm_pref_winning_message',
  payment_notifications: 'comm_pref_payment_message',
};

const CommunicationPrefCard = ({
  title,
  subText,
  fields,
  setValues,
  values,
  registerField,
  mobilePref,
}: CommunicationPrefProps) => {
  const { t } = useI18n();

  return (
    <li className="communication-prefs__pref">
      <h6 className="communication-prefs__pref-title">{t(title)}</h6>
      <p className="communication-prefs__pref-text">{t(subText)}</p>
      {mobilePref &&
        Object.keys(fields).map(key => (
          <div className="communication-prefs__pref-item" key={key}>
            <span>
              {t(key)}
              <br></br>
              <p className="communication-prefs__pref-text">
                {t(mobilePreferences[key])}
              </p>
            </span>
            <span className="ml-auto d-flex align-items-center">
              <CustomToggleCheck
                {...registerField(key)}
                id={t(key)}
                checked={values[key]}
                className="mb-0"
                onClick={() => {
                  setValues({
                    ...values,
                    [key]: values[key] === 1 ? 0 : 1,
                  });
                }}
              />
            </span>
          </div>
        ))}
      {!mobilePref &&
        Array.isArray(fields) &&
        fields.map(field => (
          <div className="communication-prefs__pref-item" key={field.id}>
            <span>{t(field.title)}</span>
            <span className="ml-auto d-flex align-items-center">
              <CustomToggleCheck
                {...registerField(field.id)}
                id={t(field.id)}
                checked={values[field.id] === 1 ? true : false}
                className="mb-0"
                onClick={() => {
                  setValues({
                    ...values,
                    [field.id]: values[field.id] === 1 ? 0 : 1,
                  });
                }}
              />
            </span>
          </div>
        ))}
    </li>
  );
};

const questionItems = [
  {
    title: 'communication_question_1',
    body: 'communication_answer_1',
  },
  {
    title: 'communication_question_2',
    body: 'communication_answer_2',
  },
];

const CommunicationPreferencesPage = () => {
  const { t, jsxT } = useI18n();
  const communicationPref = ComponentSettings?.communicationPreferences;
  const { data, error, mutate } = useApi<any>(
    `/railsapi/${communicationPref?.endPointVerison}/user/profile/communication_preferences`,
  );
  const { handleSubmit, formState, register } = useForm();
  const [checkboxValues, setCheckboxValues] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const isDataLoading = !data && !error;
  const gdprSettingUrl = '/railsapi/v1/user/settings/change_gdpr_settings';
  useEffect(() => {
    communicationPref?.mobilePref
      ? data?.Data &&
        setFilteredData(
          Object.keys(data.Data)
            .filter(key => key in mobilePreferences)
            .reduce((cur, key) => {
              return Object.assign(cur, { [key]: data.Data[key] });
            }, {}),
        )
      : data?.blocks &&
        setCheckboxValues(
          data.blocks
            .reduce((acc, block) => acc.concat(block.fields), [])
            .filter(
              field => field.default !== undefined && field.default !== null,
            )
            .reduce((obj, value) => {
              obj[value.id] = value.default;
              return obj;
            }, {}),
        );
  }, [data]);
  useEffect(() => {
    filteredData && setCheckboxValues(filteredData);
  }, [filteredData]);
  const handleOnSubmit = async (
    url: string,
    body: any,
    formBody: boolean = false,
  ): Promise<void> => {
    setApiResponse(null);
    const res = await postApi<RailsApiResponse<null>>(url, body, {
      formData: formBody,
    }).catch((res: RailsApiResponse<null>) => {
      return res;
    });
    if (res.Success) {
      mutate();
    }
    setApiResponse({
      success: res.Success,
      msg: res.Message || t('api_response_failed'),
    });
    return;
  };

  const updateSettingsSubmit = useCallback(() => {
    const body = Object.keys(checkboxValues).reduce(
      (obj, key) => {
        obj['gdpr_config'][key] = Number(checkboxValues[key]);
        return obj;
      },
      { gdpr_config: {} },
    );
    return handleOnSubmit(gdprSettingUrl, body);
  }, [checkboxValues]);
  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <form onSubmit={handleSubmit(updateSettingsSubmit)}>
        <h1 className="account-settings__title">
          {jsxT('communication_preferences_page_title')}
        </h1>
        <p className="account-settings__sub-text">
          {jsxT('communication_preferences_page_sub_text')}
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
        {!!data && (
          <div className="communication-prefs-wrp">
            <CustomAlert
              show={!!apiResponse}
              variant={
                (apiResponse && (apiResponse.success ? 'success' : 'danger')) ||
                ''
              }
              className="mb-3"
            >
              <div
                dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }}
              />
            </CustomAlert>
            <ul className="list-unstyled communication-prefs">
              {communicationPref?.mobilePref ? (
                <CommunicationPrefCard
                  key={'notifications_preferences'}
                  title={'notifications_preferences'}
                  subText={'notifications_preferences_note'}
                  fields={filteredData}
                  values={checkboxValues}
                  setValues={setCheckboxValues}
                  registerField={register}
                  mobilePref={communicationPref!.mobilePref}
                />
              ) : (
                data.blocks.map(block => (
                  <CommunicationPrefCard
                    key={block.id}
                    title={block.title}
                    subText={block.note}
                    fields={block.fields}
                    values={checkboxValues}
                    setValues={setCheckboxValues}
                    registerField={register}
                    mobilePref={communicationPref!.mobilePref}
                  />
                ))
              )}
            </ul>
            <LoadingButton
              loading={formState.isSubmitting}
              disabled={!!!Object.keys(formState.dirtyFields).length}
              variant="primary"
              type="submit"
            >
              {t('communications_submit')}
            </LoadingButton>
          </div>
        )}
      </form>
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['faq', 'phone', 'email']}
        className="d-block d-xl-none"
      />
    </main>
  );
};

export default CommunicationPreferencesPage;
