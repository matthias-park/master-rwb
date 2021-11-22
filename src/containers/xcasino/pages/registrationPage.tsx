import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import PageHeader from '../components/PageHeader';
import { FilePicker } from './documentsPage';
import MaxBalanceTable from '../components/MaxBalanceTable';
import { LimitContainer, LimitTable } from './limitsPage';
import useApi from '../../../hooks/useApi';
import Spinner from 'react-bootstrap/esm/Spinner';
import { FormProvider, useForm } from 'react-hook-form';
import Form from 'react-bootstrap/esm/Form';
import TextInput from '../../../components/customFormInputs/TextInput';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { removeFalsyFromObject } from '../../../utils';
import { postApi } from '../../../utils/apiUtils';
import LoadingButton from '../../../components/LoadingButton';
import { useCompleteRegistration } from '../../../hooks/useCompleteRegistration';
import CustomAlert from '../components/CustomAlert';

const RegistrationPage = () => {
  const {
    completedActions,
    isRegDataLoading,
    updateCompletedActions,
  } = useCompleteRegistration();
  const { t } = useI18n();
  const [filteredLimits, setFilteredLimits] = useState<Object | null>(null);
  const [apiBankError, setApiBankErr] = useState('');
  const { data, mutate } = useApi<any>('/railsapi/v1/user/profile/play_limits');

  const [apiBankResponse, setApiBankResponse] = useState<{
    success: boolean | null;
    msg: string | null;
  } | null>(null);

  const formMethods = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!!data) {
      const filtered = data?.limits?.filter(limit => {
        const filterSessionLimits =
          limit.id.includes('session_limit') &&
          !completedActions?.sessionLimitAdded;

        const filterDepositLimits =
          limit.id.includes('deposit_limit_count') &&
          !completedActions?.depositLimitCountAdded;

        return filterSessionLimits || filterDepositLimits;
      });
      setFilteredLimits({ limits: filtered });
    }
  }, [data]);

  const [showLimit, setShowLimit] = useState<{
    data: any;
    type?: string;
  } | null>(null);

  const [limitResponse_, setLimitResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const addBankAccountSubmit = async data => {
    removeFalsyFromObject(data);
    data = {
      account_number: data.account_number,
      swift: 'swft',
      address: '/railsapi/v1/user/bank',
    };
    const res = await postApi<RailsApiResponse<any>>(
      '/restapi/v1/user/bank',
      data,
    ).catch((err: RailsApiResponse<any>) => err);
    if (res.Success) {
      setApiBankResponse({
        success: res.Success,
        msg: res.Message,
      });
      updateCompletedActions(prevState => {
        return {
          ...prevState,
          bankAdded: res.Success,
        };
      });
    }
    return res.Success || res.Message || false;
  };

  const handleIBANSubmit = async ({ account_number }) => {
    const result = await addBankAccountSubmit({
      account_number: `${account_number}`,
    });
    if (typeof result === 'string' || !result) {
      return setApiBankErr(result || t('failed_to_add_bank_account'));
    }
  };

  return (
    <>
      {isRegDataLoading ? (
        <div className="d-flex register-page">
          <Spinner animation="border" variant="white" className="m-auto" />
        </div>
      ) : (
        <div>
          <PageHeader title={t('register_page_title')} icon="icon-profile" />
          <div className="register-page">
            {showLimit ? (
              <LimitContainer
                setApiResponse={setLimitResponse}
                limitData={showLimit}
                hideLimit={() => setShowLimit(null)}
                mutate={mutate}
              />
            ) : (
              <>
                {!!filteredLimits && (
                  <>
                    <h4 className="register-page__content-title">
                      To complete registration, please complete the following
                      actions
                    </h4>
                    {!completedActions?.documentsAdded && <FilePicker />}
                    {!completedActions?.maxBalanceAdded && (
                      <MaxBalanceTable
                        needsOptions
                        setShowLimit={setShowLimit}
                        title="Set Max Balance"
                      />
                    )}
                    {(!completedActions.depositLimitCountAdded ||
                      !completedActions.sessionLimitAdded) && (
                      <LimitTable
                        setShowLimit={setShowLimit}
                        data={filteredLimits}
                        title="Set Limits"
                      />
                    )}
                    {!(
                      apiBankResponse?.success || completedActions?.bankAdded
                    ) && (
                      <FormProvider {...formMethods}>
                        <Form
                          onSubmit={formMethods.handleSubmit(handleIBANSubmit)}
                        >
                          <CustomAlert
                            show={!!apiBankResponse}
                            variant={
                              apiBankResponse?.success ? 'success' : 'danger'
                            }
                          >
                            {!!apiBankResponse && apiBankResponse.msg}
                          </CustomAlert>
                          <TextInput
                            id="account_number"
                            title={t('add_bank_modal_account_number')}
                            rules={{
                              required: true,
                              validate: (value: string) => value.length === 18,
                            }}
                          />
                          <LoadingButton
                            loading={formMethods.formState.isSubmitting}
                            className="rounded-pill"
                            variant="primary"
                            type="submit"
                          >
                            {t('add_bank_modal_save')}
                          </LoadingButton>
                        </Form>
                      </FormProvider>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationPage;
