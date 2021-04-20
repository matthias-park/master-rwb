import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useI18n } from '../../hooks/useI18n';
import { ComponentName } from '../../constants';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { ControlledTextInput } from '../TextInput';
import CustomAlert from '../CustomAlert';
import LoadingButton from '../LoadingButton';
import GenericModal from '../../components/modals/GenericModal';
import { useModal } from '../../hooks/useModal';

interface Props {
  onSubmit: SubmitHandler<Record<string, any>>;
}

const AddBankAccountModal = ({ onSubmit }: Props) => {
  const { t } = useI18n();
  const [apiError, setApiErr] = useState('');
  const { disableModal } = useModal();
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const handleSubmit = async ({ account_number }) => {
    const result = await onSubmit({ account_number: `BE${account_number}` });
    if (typeof result === 'string') {
      return setApiErr(result);
    }
    if (result) {
      return disableModal(ComponentName.AddBankAccountModal);
    }
  };
  return (
    <GenericModal
      isCentered
      show
      hideCallback={() => disableModal(ComponentName.AddBankAccountModal)}
    >
      <h2 className="mb-2 text-gray-800">{t('add_bank_modal_title')}</h2>
      <CustomAlert show={!!apiError} variant="danger" className="mt-2">
        {apiError!}
      </CustomAlert>
      <p className="text-gray-700 mb-3">{t('add_bank_modal_text')}</p>
      <FormProvider {...formMethods}>
        <Form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <ControlledTextInput
            id="account_number"
            placeholder={t('add_bank_modal_account_number')}
            error={formMethods.formState.errors.account_number}
            inputFormatting={{
              format: 'BE## #### #### ####',
              mask: '_',
              placeholder: 'BE',
            }}
            rules={{
              required: `${t('add_bank_modal_account_number')} ${t(
                'add_bank_modal_input_required',
              )}`,
              validate: (value: string) =>
                value.length === 14 || t('bank_account_bad_format'),
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
