import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import GenericModal from './GenericModal';
import { useI18n } from '../../../../hooks/useI18n';
import Lockr from 'lockr';
import { stringToMiliseconds } from '../../../../utils/index';
import { ComponentName } from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import { useAuth } from '../../../../hooks/useAuth';

const ResponsibleGamblingModal = () => {
  const { user } = useAuth();
  const { jsxT, t } = useI18n();
  const intervalRef = useRef(0);
  const { activeModal, enableModal, disableModal } = useModal();
  const modalActive = activeModal === ComponentName.ResponsibleGamblingModal;
  console.log(modalActive, activeModal);
  useEffect(() => {
    const setModal = () => {
      enableModal(ComponentName.ResponsibleGamblingModal);
    };
    const interval = stringToMiliseconds(
      Lockr.get('responsibleGamlingInterval', '0:20:0'),
    );
    if (
      !modalActive &&
      user.logged_in &&
      !(user.tnc_required ?? true) &&
      interval
    ) {
      intervalRef.current = setInterval(setModal, interval);
    }
    return () => clearInterval(intervalRef.current);
  }, [modalActive, user]);

  const hideModal = () => disableModal(ComponentName.ResponsibleGamblingModal);

  return (
    <GenericModal
      show={modalActive}
      hideCallback={hideModal}
      isCentered={true}
      isStatic={true}
      className="text-center pb-4"
    >
      <div className="play-responsible-block mb-3 py-3 py-sm-1 pl-2 pr-4 pr-sm-2">
        <i className="icon-thumbs"></i>
        {jsxT('play_responsible_block_link', {
          onClick: hideModal,
        })}
      </div>
      <h2 className="mb-3 mt-4">{t('responsible_gambling_title')}</h2>
      <p>{jsxT('responsible_gambling_body', { onClick: hideModal })}</p>
      <Button onClick={hideModal} variant="primary" className="mx-auto mt-4">
        {t('responsible_gambling_close')}
      </Button>
      {/* <div className="custom-modal__footer">
        <div className="custom-modal__footer-bnl mx-auto">
          <Link onClick={hideModal} to={responsibleGamingPath}>
            <img
              alt="bnl-restrictions"
              height="45"
              className="mr-2"
              src={`/assets/images/restrictions/bnl-${locale}.svg`}
            />
          </Link>
        </div>
      </div> */}
    </GenericModal>
  );
};

export default ResponsibleGamblingModal;
