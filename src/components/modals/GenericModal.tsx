import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import Modal from 'react-bootstrap/Modal';
import clsx from 'clsx';

interface Props {
  show: boolean;
  children: JSX.Element | JSX.Element[];
  hideCallback: () => void;
  isCentered?: boolean;
  isStatic?: boolean;
  withoutClose?: boolean;
  className?: string;
}
const GenericModal = ({
  show,
  children,
  hideCallback,
  isCentered,
  isStatic,
  withoutClose,
  className,
}: Props) => {
  const { t } = useI18n();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  return (
    <Modal
      show={show}
      onHide={hideCallback}
      backdrop={isStatic && 'static'}
      centered={isCentered}
      dialogClassName="generic-modal-width"
    >
      {!withoutClose && (
        <i className="icon-close custom-modal__close" onClick={hideCallback} />
      )}
      <Modal.Body className={clsx('custom-modal mt-2 pb-4', className)}>
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
            <img
              alt="bnl-restrictions"
              height="45"
              className="mr-2"
              src={`/assets/images/restrictions/bnl-${locale}.svg`}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GenericModal;
