import React, { useEffect } from 'react';
import { postApi } from '../../utils/apiUtils';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { removeFalsyFromObject } from '../../utils/index';
import ValidationFailedModal from './components/modals/ValidationFailedModal';
import { useI18n } from '../../hooks/useI18n';
import {
  ComponentName,
  ComponentSettings,
  usaOnlyBrand,
} from '../../constants';
import PlayerDisabledModal from './components/modals/PlayerDisabledModal';
import QuickDepositModal from './components/modals/QuickDepositModal';
import W9WinningsModal from './components/modals/W9WinnningsModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import loadable from '@loadable/component';
import useGTM from '../../hooks/useGTM';

const LoadableTermsAndConditionsModal = loadable(
  () => import('./components/modals/TermsAndConditionsModal'),
);
const LoadableResponsibleGamblingModal = loadable(
  () => import('./components/modals/ResponsibleGamblingModal'),
);
const LoadableGeoComplyModal = loadable(
  () => import('./components/modals/GeoComplyModal'),
);
const LoadableDepositThresholdModal = loadable(
  () => import('./components/modals/DepositThresholdModal'),
);
const LoadableCookiePolicyModal = loadable(
  () => import('./components/modals/CookiePolicyModal'),
);
const LoadableAddBankAccountModal = loadable(
  () => import('./components/modals/AddBankAccountModal'),
);
const LoadablePromoClaimModal = loadable(
  () => import('./components/modals/PromoClaimModal'),
);

const LoadableCasinoGameInfoModal = loadable(
  () => import('./components/modals/CasinoGameInfoModal'),
);
const LoadableDynamicKBAQuestionsModal = loadable(
  () => import('./components/modals/questionsKBAModal'),
);
const LoadableLimitsReaffirmationModal = loadable(
  () => import('./components/modals/LimitsReaffirmationModal'),
);

const addBankAccountSubmit = async data => {
  removeFalsyFromObject(data);
  const res = await postApi<RailsApiResponse<null>>(
    '/restapi/v1/user/bank',
    data,
  ).catch((err: RailsApiResponse<null>) => err);
  return res.Success || res.Message || false;
};

const Modals = () => {
  const { hasTranslations } = useI18n();
  const sendDataToGTM = useGTM();
  const activeModal = useSelector((state: RootState) => state.modals[0]);

  useEffect(() => {
    if (hasTranslations && activeModal && typeof activeModal === 'string') {
      sendDataToGTM({
        'tglab.ActiveModal': activeModal,
        event: 'ModalActiveChange',
      });
    }
  }, [hasTranslations, activeModal]);

  if (!hasTranslations) {
    return null;
  }
  return (
    <>
      <LoadablePromoClaimModal />
      <LoadableTermsAndConditionsModal />
      {ComponentSettings?.modals.ResponsibleGambling && (
        <LoadableResponsibleGamblingModal />
      )}
      {ComponentSettings?.modals.DepositThreshold && (
        <LoadableDepositThresholdModal />
      )}
      <ValidationFailedModal />
      {usaOnlyBrand && <W9WinningsModal />}
      {ComponentSettings?.modals.GeoComply && <LoadableGeoComplyModal />}
      <PlayerDisabledModal />
      {activeModal === ComponentName.CookiesModal && (
        <LoadableCookiePolicyModal />
      )}
      <QuickDepositModal />
      {activeModal === ComponentName.AddBankAccountModal && (
        <LoadableAddBankAccountModal onSubmit={addBankAccountSubmit} />
      )}
      {activeModal === ComponentName.CasinoGameInfoModal && (
        <LoadableCasinoGameInfoModal />
      )}
      {ComponentSettings?.modals.KBAQuestions && (
        <LoadableDynamicKBAQuestionsModal />
      )}
      <LoadableLimitsReaffirmationModal />
    </>
  );
};

export default Modals;
