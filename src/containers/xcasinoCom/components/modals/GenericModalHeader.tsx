import React from 'react';
import { Modal } from 'react-bootstrap';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';
import clsx from 'clsx';

function GenericModalHeader({
  handleClose,
  handlePrevious,
  title,
  hideTitleMobile,
}: {
  handleClose?: () => void;
  handlePrevious?: () => void | undefined;
  title?: string | undefined;
  hideTitleMobile?: boolean;
}) {
  const desktopWidth = useDesktopWidth(900);
  const closeModal = () => !!handleClose && handleClose();

  return (
    <Modal.Header>
      {(!desktopWidth || !!handlePrevious) && (
        <i
          className="icon-left"
          onClick={
            !handlePrevious ? () => closeModal() : () => handlePrevious()
          }
        />
      )}
      {!!handleClose && <i className="icon-close" onClick={closeModal} />}
      <h4>
        <span>XCASINO</span>
      </h4>
      <Modal.Title className={clsx(hideTitleMobile && 'd-none d-md-block')}>
        {title}
      </Modal.Title>
    </Modal.Header>
  );
}

export default GenericModalHeader;
