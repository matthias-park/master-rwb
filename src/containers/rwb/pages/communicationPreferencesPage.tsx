import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import CustomToggleCheck from '../components/CustomToggleCheck';
import Spinner from 'react-bootstrap/Spinner';
import useApi from '../../../hooks/useApi';
import CustomAlert from '../components/CustomAlert';
import { useForm } from 'react-hook-form';
import LoadingButton from '../../../components/LoadingButton';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { postApi } from '../../../utils/apiUtils';
import { Config } from '../../../constants';

interface CommunicationPrefProps {
  title: string;
  subText: string;
  fields: {
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
}

const CommunicationPrefCard = ({
  title,
  subText,
  fields,
  setValues,
  values,
  registerField,
}: CommunicationPrefProps) => {
  const { t } = useI18n();

  return (
    <li className="communication-prefs__pref">
      <h6 className="communication-prefs__pref-title">{t(title)}</h6>
      {fields.map(field => (
        <div className="communication-prefs__pref-item" key={field.id}>
          <span>{t(field.title)}</span>
          <span className="ml-auto d-flex align-items-center">
            <CustomToggleCheck
              {...registerField(field.id)}
              id={t(field.id)}
              checked={values[field.id] === 1 ? true : false}
              onClick={() =>
                setValues({
                  ...values,
                  [field.id]: values[field.id] === 1 ? 0 : 1,
                })
              }
            />
          </span>
        </div>
      ))}
    </li>
  );
};

const CommunicationPreferencesPage = () => {
  const { t, jsxT } = useI18n();
  const { data, error } = useApi<any>(
    '/restapi/v3/user/profile/communication_preferences',
  );
  const { watch, handleSubmit, formState, register, reset } = useForm();
  const [newsLetterChecked, setNewsLetterChecked] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState({});
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const isDataLoading = !data && !error;
  const allSettingIds = useMemo(() => {
    return data?.blocks?.[0]?.fields.map(field => field.id);
  }, [data]);
  const someChecked = useMemo(() => {
    return !!data && Object.values(checkboxValues).some(val => !!val);
  }, [data, checkboxValues]);

  useEffect(() => {
    data?.blocks &&
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

  const handleOnSubmit = async (
    url: string,
    body: any,
    formBody: boolean = false,
  ): Promise<void> => {
    setApiResponse(null);
    let newUrl;
    if (process.env.NODE_ENV === 'development') {
      const apiDomain = (Config as any)?.domains[0].api;
      newUrl = url.replace(apiDomain, '');
    }
    const res = await postApi<RailsApiResponse<null>>(newUrl, body, {
      formData: formBody,
    }).catch((res: RailsApiResponse<null>) => res);
    if (res.Success) {
      reset({ ...watch() });
    }
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
    return handleOnSubmit(data.action, body);
  }, [checkboxValues]);

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <form onSubmit={handleSubmit(updateSettingsSubmit)}>
        <h1>{jsxT('communication_preferences_page_title')}</h1>
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
        {!!data && (
          <div className="communication-prefs-wrp mt-3">
            <CustomAlert
              show={!!apiResponse}
              variant={
                (apiResponse && (apiResponse.success ? 'success' : 'danger')) ||
                ''
              }
              className="mb-0"
            >
              <div
                dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }}
              />
            </CustomAlert>
            <div className="list-unstyled communication-prefs">
              <li className="communication-prefs__pref">
                <h6 className="communication-prefs__pref-title">
                  {t('master_gdpr_setting_title')}
                </h6>
                <div className="communication-prefs__pref-item">
                  <span>{t('master_gdpr_setting_name')}</span>
                  <span className="ml-auto d-flex align-items-center">
                    <CustomToggleCheck
                      id={'master_gdpr_setting'}
                      checked={someChecked}
                      onChange={e => {
                        setNewsLetterChecked(true);
                        if (someChecked) {
                          setCheckboxValues(
                            allSettingIds.reduce((acc, curr) => {
                              acc[curr] = 0;
                              return acc;
                            }, {}),
                          );
                        } else {
                          setCheckboxValues(
                            allSettingIds.reduce((acc, curr) => {
                              acc[curr] = 1;
                              return acc;
                            }, {}),
                          );
                        }
                      }}
                    />
                  </span>
                </div>
              </li>
              {data.blocks.map(block => (
                <CommunicationPrefCard
                  key={block.id}
                  title={block.title}
                  subText={block.note}
                  fields={block.fields}
                  values={checkboxValues}
                  setValues={setCheckboxValues}
                  registerField={register}
                />
              ))}
            </div>
            <LoadingButton
              loading={formState.isSubmitting}
              disabled={!formState.isDirty && !newsLetterChecked}
              className="mt-3"
              variant="primary"
              type="submit"
            >
              {t('communications_submit')}
            </LoadingButton>
          </div>
        )}
      </form>
    </main>
  );
};

export default CommunicationPreferencesPage;
