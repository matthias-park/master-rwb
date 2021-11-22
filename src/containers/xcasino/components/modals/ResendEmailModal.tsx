import React, { useState } from 'react';
import { useModal } from '../../../../hooks/useModal';
import GenericModalHeader from './GenericModalHeader';
import { ComponentName, VALIDATIONS } from '../../../../constants';
import { Form, Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '../../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import CustomAlert from '../CustomAlert';

const ResendEmailModal = () => {
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const onSubmit = ({ email }) => {
    return setApiResponse({
      success: true,
      msg: 'Something went wrong',
    });
  };

  const formMethods = useForm({
    mode: 'onBlur',
  });

  const { t } = useI18n();
  const { handleSubmit, formState } = formMethods;
  const { activeModal, disableModal } = useModal();
  const closeModal = () => disableModal(ComponentName.ResendEmailModal);

  return (
    <Modal
      show={activeModal === ComponentName.ResendEmailModal}
      centered
      dialogClassName="forgot-password-modal"
    >
      <GenericModalHeader
        title={
          !apiResponse?.success ? 'Resend Activation Link' : 'Check your email'
        }
        handleClose={closeModal}
      />
      <Modal.Body>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <CustomAlert
              show={formState.isSubmitted && !apiResponse?.success}
              variant="danger"
            >
              <div
                dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }}
              />
            </CustomAlert>
            {!apiResponse?.success ? (
              <>
                <TextInput
                  rules={{
                    required: t('forgot_password_field_required'),
                    validate: async value =>
                      VALIDATIONS.email(value) ||
                      t('register_email_bad_format'),
                  }}
                  id="email"
                  title="Enter your account email"
                />
              </>
            ) : (
              <p>
                An e-mail with further instructions has been sent to your email
                account. Follow instructions to reset your password.
              </p>
            )}
            <LoadingButton
              variant="primary"
              onClick={() => {
                if (apiResponse?.success) {
                  closeModal();
                }
              }}
              type={!apiResponse?.success ? 'submit' : 'button'}
              disabled={!!formState.errors.email || !formState.isDirty}
              loading={formState.isSubmitting}
              data-testid="button"
              className="btn btn-primary mt-3 w-100 rounded-pill"
            >
              {!apiResponse?.success ? 'Submit' : 'Finish'}
            </LoadingButton>
          </Form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <span>Need Help?</span>
        <a href="/help" className="modal-link">
          Click Here
        </a>
      </Modal.Footer>
    </Modal>
  );
};

export default ResendEmailModal;
