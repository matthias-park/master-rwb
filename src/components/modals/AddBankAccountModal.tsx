import React from 'react';
import { Form } from 'react-bootstrap';
import { useI18n } from '../../hooks/useI18n';
import Modal from 'react-bootstrap/Modal';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ComponentName } from '../../constants';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { ControlledTextInput } from '../TextInput';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
  onSubmit: SubmitHandler<Record<string, any>>;
}

const AddBankAccountModal = ({ onSubmit }: Props) => {
  const { t } = useI18n();
  const { showModal, setShowModal } = useUIConfig();
  const formMethods = useForm({
    mode: 'onBlur',
  });
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
          <Form onSubmit={formMethods.handleSubmit(onSubmit)}>
            {['account_number', 'swift', 'address'].map(id => (
              <ControlledTextInput
                id={id}
                placeholder={t(`add_bank_modal_${id}`)}
                error={formMethods.errors[id]}
                rules={{
                  required:
                    id === 'account_number' &&
                    t('add_bank_modal_input_required'),
                }}
              />
            ))}
            <Button className="mt-2" variant="primary" type="submit">
              {formMethods.formState.isSubmitting && (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{' '}
                </>
              )}
              {t('add_bank_modal_save')}
            </Button>
          </Form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};

export default AddBankAccountModal;
