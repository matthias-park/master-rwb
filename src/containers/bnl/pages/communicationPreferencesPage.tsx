import React, { useState, useMemo, useCallback } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import CustomToggleCheck from '../components/CustomToggleCheck';
import Spinner from 'react-bootstrap/Spinner';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../../hooks/useApi';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import CustomAlert from '../components/CustomAlert';
import { useForm } from 'react-hook-form';
import LoadingButton from '../../../components/LoadingButton';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { useAuth } from '../../../hooks/useAuth';
import { postApi } from '../../../utils/apiUtils';

interface CommunicationPrefProps {
  id: string;
  title: string;
  subText: string;
  fields: {
    id: string;
    title: string;
    type: string;
    default: number;
  }[];
  action: string;
}

const CommunicationPrefCard = ({
  id,
  title,
  subText,
  fields,
  action,
}: CommunicationPrefProps) => {
  const { addToast } = useToasts();
  const { user } = useAuth();
  const { t } = useI18n();
  const { handleSubmit, formState } = useForm();
  const [checkboxValues, setCheckboxValues] = useState(
    fields
      .filter(field => field.default !== undefined && field.default !== null)
      .reduce((obj, value) => {
        obj[value.id] = Boolean(value.default);
        obj[value.id] = value.default?.toString();
        return obj;
      }, {}),
  );
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const handleOnSubmit = async (
    url: string,
    body: any,
    formBody: boolean = false,
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
    return;
  };

  const updateSettingsSubmit = useCallback(() => {
    const body = {
      gdpr_config: Object.keys(checkboxValues).reduce((obj, key) => {
        obj[key] = Number(checkboxValues[key]);
        return obj;
      }, {}),
    };
    return handleOnSubmit(action, body);
  }, [checkboxValues]);

  return (
    <li className="communication-prefs__pref">
      <form onSubmit={handleSubmit(updateSettingsSubmit)}>
        <CustomAlert
          show={!!apiResponse}
          variant={apiResponse?.success ? 'success' : 'danger'}
          className="mb-3"
        >
          <div dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }} />
        </CustomAlert>
        <h6 className="communication-prefs__pref-title">{t(title)}</h6>
        <p className="communication-prefs__pref-text">{t(subText)}</p>
        {fields.map(field => (
          <div className="communication-prefs__pref-item">
            <span>{t(field.title)}</span>
            <span className="ml-auto d-flex align-items-center">
              <CustomToggleCheck
                id={t(field.id)}
                checked={checkboxValues[field.id] === 1 ? true : false}
                onChange={() =>
                  setCheckboxValues({
                    ...checkboxValues,
                    [field.id]: checkboxValues[field.id] === 1 ? '0' : '1',
                  })
                }
              />
            </span>
          </div>
        ))}
        <LoadingButton
          loading={formState.isSubmitting}
          className="mt-3"
          variant="primary"
          type="submit"
        >
          {t('communications_submit')}
        </LoadingButton>
      </form>
    </li>
  );
};

const CommunicationPreferencesPage = () => {
  const { t } = useI18n();
  const { data, error } = useApi<any>(
    '/railsapi/v1/user/profile/communication_preferences',
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
      <h1>{t('communication_preferences_page_title')}</h1>
      <p className="mb-4">{t('communication_preferences_page_sub_text')}</p>
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
      {!!data && (
        <ul className="list-unstyled communication-prefs">
          {data.blocks.map(block => (
            <CommunicationPrefCard
              id={block.id}
              title={block.title}
              subText={block.note}
              fields={block.fields}
              action={block.action}
            />
          ))}
        </ul>
      )}
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['phone']}
        className={'d-block d-xl-none'}
      />
    </main>
  );
};

export default CommunicationPreferencesPage;
