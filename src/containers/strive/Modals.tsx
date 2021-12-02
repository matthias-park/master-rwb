import React from 'react';
import { postApi } from '../../utils/apiUtils';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { removeFalsyFromObject } from '../../utils/index';
import ValidationFailedModal from './components/modals/ValidationFailedModal';
import { useI18n } from '../../hooks/useI18n';
import { ComponentName, ComponentSettings } from '../../constants';
import PlayerDisabledModal from './components/modals/PlayerDisabledModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import loadable from '@loadable/component';

const LoadableTermsAndConditionsModal = loadable(
  () => import('./components/modals/TermsAndConditionsModal'),
);
const LoadableResponsibleGamblingModal = loadable(
  () => import('./components/modals/ResponsibleGamblingModal'),
);
const LoadableGeoComplyModal = loadable(
  () => import('./components/modals/GeoComplyModal'),
);
const LoadableCookiePolicyModal = loadable(
  () => import('./components/modals/CookiePolicyModal'),
);
const LoadableAddBankAccountModal = loadable(
  () => import('./components/modals/AddBankAccountModal'),
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
  const activeModal = useSelector((state: RootState) => state.modals[0]);
  if (!hasTranslations) {
    return null;
  }
  return (
    <>
      <LoadableTermsAndConditionsModal />
      {ComponentSettings?.modals.ResponsibleGambling && (
        <LoadableResponsibleGamblingModal />
      )}
      <ValidationFailedModal />
      {ComponentSettings?.modals.GeoComply && <LoadableGeoComplyModal />}
      <PlayerDisabledModal />
      {activeModal === ComponentName.CookiesModal && (
        <LoadableCookiePolicyModal />
      )}
      {activeModal === ComponentName.AddBankAccountModal && (
        <LoadableAddBankAccountModal onSubmit={addBankAccountSubmit} />
      )}
    </>
  );
};

export default Modals;
