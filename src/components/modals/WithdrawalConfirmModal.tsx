import React from 'react';
import {
  WithdrawalConfirmation,
  WithdrawalConfirmationParams,
} from '../../types/api/user/Withdrawal';
import { useI18n } from '../../hooks/useI18n';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

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
    <Modal show={true} onHide={onCancel} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('withdrawal_page_withdrawal_confirm')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {Object.keys(data.confirm_info).map(key => (
          <div key={key}>
            {t(`withdrawal_page_${key}`)}: {data.confirm_info[key]}
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onCancel} variant="secondary" className="mx-auto">
          {t('withdrawal_page_cancel')}
        </Button>
        <Button
          onClick={() => {
            onConfirm(data.params);
          }}
          variant="primary"
          className="mx-auto"
        >
          {loading && (
            <Spinner
              data-testid="spinner"
              as="span"
              animation="border"
              size="sm"
              role="status"
              className="mr-1"
            />
          )}
          {t('withdrawal_page_confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WithdrawalConfirmModal;
