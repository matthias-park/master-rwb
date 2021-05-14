import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import GenericModal from './GenericModal';
import { useI18n } from '../../../../hooks/useI18n';
import { useConfig } from '../../../../hooks/useConfig';
import Lockr from 'lockr';
import { stringToMiliseconds } from '../../../../utils/index';
import { ComponentName } from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import { useAuth } from '../../../../hooks/useAuth';
import { usePrevious } from '../../../../hooks';

const ResponsibleGamblingModal = () => {
  const { user } = useAuth();
  const { jsxT, t } = useI18n();
  const prevUser = usePrevious(user.logged_in);
  const intervalRef = useRef(0);
  const { activeModal, enableModal, disableModal } = useModal();
  const modalActive = activeModal === ComponentName.ResponsibleGamblingModal;
  useEffect(() => {
    const setModal = () => {
      enableModal(ComponentName.ResponsibleGamblingModal);
    };
    const interval = stringToMiliseconds(
      Lockr.get('responsibleGamlingInterval', '0:20:0'),
    );
    if (!modalActive && user.logged_in && interval) {
      if (user.logged_in && !prevUser && user.login_click) {
        setModal();
      } else {
        intervalRef.current = setInterval(setModal, interval);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [modalActive, user]);

  const hideModal = () => disableModal(ComponentName.ResponsibleGamblingModal);
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);

  return (
    <GenericModal
      show={modalActive}
      hideCallback={hideModal}
      isCentered={true}
      isStatic={true}
      className="text-center pb-4"
    >
      <div className="play-responsible-block mb-3 py-1">
        <i className="icon-thumbs"></i>
        {jsxT('play_responsible_block_link')}
      </div>
      <h2 className="mb-3 mt-4">{t('responsible_gambling_title')}</h2>
      <p>{t('responsible_gambling_body')} {jsxT('responsible_gambling_body_link')}</p>
      <Button onClick={hideModal} variant="primary" className="mx-auto mt-4">
        {t('responsible_gambling_close')}
      </Button>
      <div className="custom-modal__footer">
        <div className="custom-modal__footer-bnl mx-auto">
          <img
            alt="bnl-restrictions"
            height="45"
            className="mr-2"
            src={`/assets/images/restrictions/bnl-${locale}.svg`}
          />
        </div>
      </div>
    </GenericModal>
  );
};

export default ResponsibleGamblingModal;
