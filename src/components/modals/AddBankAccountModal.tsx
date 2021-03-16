import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useI18n } from '../../hooks/useI18n';
import Modal from 'react-bootstrap/Modal';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ComponentName } from '../../constants';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { ControlledTextInput } from '../TextInput';
import Alert from 'react-bootstrap/Alert';
import LoadingButton from '../LoadingButton';

interface Props {
  onSubmit: SubmitHandler<Record<string, any>>;
}

const AddBankAccountModal = ({ onSubmit }: Props) => {
  const { t } = useI18n();
  const [apiError, setApiErr] = useState('');
  const { showModal, setShowModal } = useUIConfig();
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const handleSubmit = async data => {
    const result = await onSubmit(data);
    if (typeof result === 'string') {
      return setApiErr(result);
    }
    if (result) {
      return setShowModal(null);
    }
  };
  return (
    <Modal
      centered
      show={showModal === ComponentName.AddBankAccountModal}
      onHide={() => setShowModal(null)}
    >
      <Modal.Body className="custom-modal">
        <i
          className="icon-close custom-modal__close"
          onClick={() => setShowModal(null)}
        ></i>
        <h2 className="mb-2 text-gray-800">{t('add_bank_modal_title')}</h2>
        <p className="text-gray-700">{t('add_bank_modal_text')}</p>
        <FormProvider {...formMethods}>
          <Form onSubmit={formMethods.handleSubmit(handleSubmit)}>
            <Alert
              show={
                !!apiError ||
                (formMethods.formState.isSubmitted &&
                  !formMethods.formState.isValid)
              }
              variant="danger"
            >
              {apiError || t('register_page_submit_error')}
            </Alert>
            {['account_number', 'swift', 'address'].map(id => (
              <ControlledTextInput
                id={id}
                key={id}
                placeholder={t(`add_bank_modal_${id}`)}
                error={formMethods.errors[id]}
                rules={{
                  required:
                    id === 'account_number' &&
                    t('add_bank_modal_input_required'),
                }}
              />
            ))}
            <LoadingButton
              loading={formMethods.formState.isSubmitting}
              className="mt-2"
              variant="primary"
              type="submit"
            >
              {t('add_bank_modal_save')}
            </LoadingButton>
          </Form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};

export default AddBankAccountModal;
