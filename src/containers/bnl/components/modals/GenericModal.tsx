import React from 'react';
import { useI18n } from '../../../../hooks/useI18n';
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
      <Modal.Body className={clsx('custom-modal mt-2', className)}>
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default GenericModal;
