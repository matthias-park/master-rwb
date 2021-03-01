import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import Modal from 'react-bootstrap/Modal';

interface Props {
  show: boolean;
  children: JSX.Element | JSX.Element[];
  hideCallback: () => void;
  isCentered?: boolean;
  isStatic?: boolean;
  withoutClose?: boolean;
}
const GenericModal = ({
  show,
  children,
  hideCallback,
  isCentered,
  isStatic,
  withoutClose,
}: Props) => {
  const { t } = useI18n();
  return (
    <Modal
      show={show}
      onHide={hideCallback}
      backdrop={isStatic && 'static'}
      centered={isCentered}
      dialogClassName="generic-modal-width"
    >
      {!withoutClose && (
        <i
          className="icon-close custom-modal__close"
          onClick={hideCallback}
        ></i>
      )}
      <Modal.Body className="custom-modal mt-2 text-center">
        {children}
        <div className="custom-modal__footer">
          <span className="text-14 font-weight-bold text-gray-700 mr-1 mr-sm-3">
            {t('moderation_gamble')}
          </span>
          <div className="d-flex align-items-center ml-1 ml-sm-3">
            <img
              alt="18-label"
              width="37"
              height="37"
              src="/assets/images/restrictions/18-label-green.png"
            />
            <p className="text-14 d-none ml-2 d-sm-block">
              {t('minimum_age_disclaimer')}
            </p>
          </div>
          <div className="custom-modal__footer-bnl ml-2 ml-sm-4">
            <div className="d-flex">
              <img
                alt="brand-logo"
                width="20"
                height="20"
                className="mr-1"
                src="/assets/images/logo/bnl-logo.svg"
              />
              <img
                alt="18-label"
                width="20"
                height="20"
                className="mr-2"
                src="/assets/images/restrictions/18-label-green.png"
              />
              <small>{t('bnl_modal_footer_text_1')}</small>
            </div>
            <small className="d-block text-center mt-1">
              {t('bnl_modal_footer_text_1')}
            </small>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GenericModal;
