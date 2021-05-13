import React from 'react';
import {
  WithdrawalConfirmation,
  WithdrawalConfirmationParams,
} from '../../../../types/api/user/Withdrawal';
import { useI18n } from '../../../../hooks/useI18n';
import GenericModal from './GenericModal';
import Button from 'react-bootstrap/Button';
import LoadingButton from '../../../../components/LoadingButton';

interface WithdrawalConfirmProps {
  data: WithdrawalConfirmation;
  onCancel: () => void;
  onConfirm: (data: WithdrawalConfirmationParams) => void;
  loading?: boolean;
}

const WithdrawalConfirmModal = ({
  data,
  onCancel,
  onConfirm,
  loading,
}: WithdrawalConfirmProps) => {
  const { t } = useI18n();
  return (
    <GenericModal
      show={true}
      hideCallback={onCancel}
      isStatic={true}
      isCentered={true}
    >
      <div>
        <h2>{t('withdrawal_page_withdrawal_confirm')}</h2>
        {Object.keys(data.confirm_info).map(key => (
          <div key={key}>
            {t(`withdrawal_page_${key}`)}: {data.confirm_info[key]}
          </div>
        ))}
        <div className="d-flex flex-column flex-sm-row mt-3">
          <LoadingButton
            onClick={() => {
              onConfirm(data.params);
            }}
            variant="primary"
            className="mr-sm-2"
            loading={loading}
          >
            {t('withdrawal_page_confirm')}
          </LoadingButton>
          <Button
            onClick={onCancel}
            variant="secondary"
            className="mt-2 mt-sm-0"
          >
            {t('withdrawal_page_cancel')}
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default WithdrawalConfirmModal;
