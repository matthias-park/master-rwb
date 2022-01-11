import React from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';

const PlayerDisabledModal = () => {
  const { t, jsxT } = useI18n();
  const { activeModal, disableModal } = useModal();
  const hideModal = () => disableModal(ComponentName.PlayerDisabledModal);

  return (
    <GenericModal
      isCentered
      show={activeModal === ComponentName.PlayerDisabledModal}
      hideCallback={() => hideModal()}
      className="pb-5"
    >
      <h2 className="mb-2">{t('player_disable_modal_title')}</h2>
      <p className="mb-3">{jsxT(`player_disable_modal_desc`)}</p>
    </GenericModal>
  );
};

export default PlayerDisabledModal;
