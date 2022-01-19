import React, { useState } from 'react';
import { useModal } from '../../../../hooks/useModal';
import GenericModalHeader from './GenericModalHeader';
import { ComponentName, PagesName, VALIDATIONS } from '../../../../constants';
import { Form, Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '../../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import CustomAlert from '../CustomAlert';
import { useRoutePath } from '../../../../hooks';

const ResendEmailModal = () => {
  const faqPath = useRoutePath(PagesName.FaqPage);
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
          !apiResponse?.success
            ? t('resend_activation_title_1')
            : t('resend_activation_title_2')
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
                  title={t('resend_activation_email_field')}
                />
              </>
            ) : (
              <p>{t('resend_activation_note')}</p>
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
              {!apiResponse?.success ? t('submit') : t('disable_button')}
            </LoadingButton>
          </Form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <span>{t('need_help')}</span>
        <a href={faqPath} className="modal-link">
          {t('click_here')}
        </a>
      </Modal.Footer>
    </Modal>
  );
};

export default ResendEmailModal;
