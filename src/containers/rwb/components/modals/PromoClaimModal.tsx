import React from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import Button from 'react-bootstrap/esm/Button';

const PromoClaimModal = () => {
  const { t } = useI18n();
  const { activeModal, disableModal } = useModal();
  const hideModal = () => disableModal(ComponentName.PromoClaimModal);

  return (
    <GenericModal
      isCentered
      show={activeModal === ComponentName.PromoClaimModal}
      hideCallback={() => hideModal()}
      className="pb-5"
    >
      <div className="d-flex justify-content-center flex-column">
        <h2 className="mb-2 text-center">{t('promo_claim_modal_title')}</h2>
        <p className="mb-3 text-center">{t('promo_claim_modal_body')}</p>
        <Button onClick={hideModal}>{t('promo_claim_modal_btn')}</Button>
      </div>
    </GenericModal>
  );
};

export default PromoClaimModal;
