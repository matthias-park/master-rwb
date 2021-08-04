import React, { useEffect } from 'react';
import ResponsibleGamblingModal from './components/modals/ResponsibleGamblingModal';
import CookiePolicyModal from './components/modals/CookiePolicyModal';
import AddBankAccountModal from './components/modals/AddBankAccountModal';
import TermsAndConditionsModal from './components/modals/TermsAndConditionsModal';
import { postApi } from '../../utils/apiUtils';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { removeFalsyFromObject } from '../../utils/index';
import ValidationFailedModal from './components/modals/ValidationFailedModal';
import { useI18n } from '../../hooks/useI18n';
import { ComponentName } from '../../constants';
import useGTM from '../../hooks/useGTM';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';

const addBankAccountSubmit = async data => {
  removeFalsyFromObject(data);
  const res = await postApi<RailsApiResponse<null>>(
    '/railsapi/v1/user/bank',
    data,
  ).catch((err: RailsApiResponse<null>) => err);
  return res.Success || res.Message || false;
};

const Modals = () => {
  const { hasTranslations } = useI18n();
  const sendDataToGTM = useGTM();
  const activeModal = useSelector((state: RootState) => state.modals[0]);

  useEffect(() => {
    if (activeModal && typeof activeModal === 'string') {
      sendDataToGTM({
        'tglab.ActiveModal': activeModal,
        event: 'ModalActiveChange',
      });
    }
  }, [activeModal]);

  if (!hasTranslations) {
    return null;
  }
  return (
    <>
      <TermsAndConditionsModal />
      <ResponsibleGamblingModal />
      <ValidationFailedModal />
      {activeModal === ComponentName.CookiesModal && <CookiePolicyModal />}
      {activeModal === ComponentName.AddBankAccountModal && (
        <AddBankAccountModal onSubmit={addBankAccountSubmit} />
      )}
    </>
  );
};

export default Modals;
