import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName } from '../../../../constants';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import CustomAlert from '../CustomAlert';
import LoadingButton from '../../../../components/LoadingButton';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import TextInput from '../../../../components/customFormInputs/TextInput';
import { useAuth } from '../../../../hooks/useAuth';

interface Props {
  onSubmit: SubmitHandler<Record<string, any>>;
}

const AddBankAccountModal = ({ onSubmit }: Props) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [apiError, setApiErr] = useState('');
  const { disableModal } = useModal();
  const formMethods = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!user.logged_in) {
      disableModal(ComponentName.AddBankAccountModal);
    }
  }, [user.logged_in]);

  const handleSubmit = async ({ account_number }) => {
    const result = await onSubmit({ account_number: `BE${account_number}` });
    if (typeof result === 'string' || !result) {
      return setApiErr(result || t('failed_to_add_bank_account'));
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
      className="pb-5"
    >
      <h2 className="mb-2 text-gray-800">{t('add_bank_modal_title')}</h2>
      <CustomAlert show={!!apiError} variant="danger" className="mt-2">
        {apiError!}
      </CustomAlert>
      <p className="text-gray-700 mb-3">{t('add_bank_modal_text')}</p>
      <FormProvider {...formMethods}>
        <Form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <TextInput
            id="account_number"
            title={t('add_bank_modal_account_number')}
            maskedInput={{
              format: 'BE## #### #### ####',
              mask: '_',
              allowEmptyFormatting: true,
            }}
            rules={{
              required: t('add_bank_modal_input_required'),
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
