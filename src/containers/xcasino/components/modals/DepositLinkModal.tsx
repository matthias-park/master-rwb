import React from 'react';
import { useModal } from '../../../../hooks/useModal';
import GenericModalHeader from './GenericModalHeader';
import { ComponentName, PagesName } from '../../../../constants';
import { useI18n } from '../../../../hooks/useI18n';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { replaceStringTagsReact } from '../../../../utils/reactUtils';
import { useRoutePath } from '../../../../hooks';
import { useCompleteRegistration } from '../../../../hooks/useCompleteRegistration';

const DepositLinkModal = () => {
  const { t } = useI18n();
  const { activeModal, disableModal } = useModal();
  const closeModal = () => disableModal(ComponentName.DepositLinkModal);
  const faqPath = useRoutePath(PagesName.FaqPage);
  const depositPath = useRoutePath(PagesName.DepositPage);
  const { registrationIncomplete } = useCompleteRegistration();

  return (
    <Modal
      show={
        activeModal === ComponentName.DepositLinkModal &&
        !registrationIncomplete
      }
      centered
      dialogClassName="deposit-link-modal"
    >
      <GenericModalHeader
        title={t('deposit_modal_title')}
        handleClose={closeModal}
      />
      <Modal.Body>
        <p className="deposit-modal__content">
          {replaceStringTagsReact(t('deposit_modal_content'))}
        </p>
        <Button
          as={Link}
          to={depositPath}
          onClick={() => disableModal(ComponentName.DepositLinkModal)}
        >
          {t('deposit_btn')}
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <span>{t('need_help_link')}</span>
        <a href={faqPath} className="modal-link">
          {t('click_here')}
        </a>
      </Modal.Footer>
    </Modal>
  );
};

export default DepositLinkModal;
