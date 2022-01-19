import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ComponentName } from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import GenericModalHeader from './GenericModalHeader';
import { Form, Modal } from 'react-bootstrap';
import LoadingButton from '../../../../components/LoadingButton';
import { getApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useI18n } from '../../../../hooks/useI18n';
import { useAuth } from '../../../../hooks/useAuth';
import CheckboxInput from '../../../../components/customFormInputs/CheckboxInput';
import CustomAlert from '../CustomAlert';
import { replaceStringTagsReact } from '../../../../utils/reactUtils';
import { useHistory, useLocation } from 'react-router';

const TermsAndConditionsModal = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const { activeModal, disableModal, enableModal } = useModal();
  const modalActive = activeModal === ComponentName.TermsAndConditionsModal;
  const closeModal = () => disableModal(ComponentName.TermsAndConditionsModal);
  const { user, signout, updateUser } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const { jsxT, t } = useI18n();
  const formMethods = useForm({
    mode: 'onChange',
  });
  const { handleSubmit, formState, watch } = formMethods;
  const watchTncCheckbox = watch('tnc_checkbox');
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const logout = async () => {
    setIsLoggingOut(true);
    await signout();
    closeModal();
    setIsLoggingOut(false);
  };

  useEffect(() => {
    if (!modalActive && user.logged_in && user.tnc_required) {
      enableModal(ComponentName.TermsAndConditionsModal);
    } else if ((!user.logged_in || !user.tnc_required) && modalActive) {
      closeModal();
      formMethods.reset();
    }
  }, [modalActive, user]);

  const onSubmit = async () => {
    const result = await getApi<RailsApiResponse<{}>>(
      '/restapi/v1/user/accept_tnc',
    ).catch(err => err);
    if (result.Success) {
      updateUser();
      closeModal();
    } else {
      setApiError(result.Message || t('terms_and_cond_modal_api_error'));
    }
  };

  return (
    <Modal
      show={modalActive && !pathname.includes('/info/tnc')}
      centered
      dialogClassName="tnc-modal"
      onShow={() => setApiResponse(null)}
    >
      <GenericModalHeader title={t('terms_and_cond_modal_title')} />
      <Modal.Body>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <CustomAlert show={!!apiError} variant="danger" className="mt-2">
              {apiError!}
            </CustomAlert>
            <div className="my-3">
              {replaceStringTagsReact(t('tnc_info_text'))}
            </div>
            <CheckboxInput
              id={'tnc_checkbox'}
              title={jsxT('terms_and_cond_modal_body')}
              defaultValue={false}
              rules={{
                required: t('tnc_checkbox_required'),
              }}
            />
            <div className="tnc-modal__btns">
              <LoadingButton
                variant="primary"
                type="submit"
                disabled={!watchTncCheckbox}
                loading={formState.isSubmitting}
                data-testid="button"
                className="btn btn-primary mt-3 w-100 rounded-pill"
              >
                {t('terms_and_cond_modal_accept')}
              </LoadingButton>
              <LoadingButton
                loading={isLoggingOut}
                variant="primary"
                data-testid="button"
                className="btn btn-primary mt-3 w-100 rounded-pill"
                onClick={logout}
              >
                {t('terms_and_cond_modal_logout')}
              </LoadingButton>
            </div>
          </Form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <div
          className="modal-link"
          onClick={() => {
            closeModal();
            history.push('/info/tnc');
          }}
        >
          {t('terms_conditions_link')}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TermsAndConditionsModal;
