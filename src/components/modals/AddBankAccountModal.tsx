import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useI18n } from '../../hooks/useI18n';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ComponentName } from '../../constants';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { ControlledTextInput } from '../TextInput';
import CustomAlert from '../CustomAlert';
import LoadingButton from '../LoadingButton';
import GenericModal from '../../components/modals/GenericModal';

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
    <GenericModal
      isCentered
      show={showModal === ComponentName.AddBankAccountModal}
      hideCallback={() => setShowModal(null)}
    >
      <h2 className="mb-2 text-gray-800">{t('add_bank_modal_title')}</h2>
      <CustomAlert
        show={
          !!apiError ||
          (formMethods.formState.isSubmitted && !formMethods.formState.isValid)
        }
        variant="danger"
        className="mt-2"
      >
        {apiError || t('register_page_submit_error')}
      </CustomAlert>
      <p className="text-gray-700 mb-3">{t('add_bank_modal_text')}</p>
      <FormProvider {...formMethods}>
        <Form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <ControlledTextInput
            id="account_number"
            placeholder={t('add_bank_modal_account_number')}
            error={formMethods.formState.errors.account_number}
            rules={{
              required: t('add_bank_modal_input_required'),
            }}
          />
          <LoadingButton
            loading={formMethods.formState.isSubmitting}
            className="mt-3"
            variant="primary"
            type="submit"
          >
            {t('add_bank_modal_save')}
          </LoadingButton>
        </Form>
      </FormProvider>
    </GenericModal>
  );
};

export default AddBankAccountModal;
