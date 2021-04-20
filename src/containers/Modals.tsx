import React from 'react';
import ResponsibleGamblingModal from '../components/modals/ResponsibleGamblingModal';
import CookiePolicyModal from '../components/modals/CookiePolicyModal';
import AddBankAccountModal from '../components/modals/AddBankAccountModal';
import { postApi } from '../utils/apiUtils';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { removeFalsyFromObject } from '../utils/index';
import ValidationFailedModal from '../components/modals/ValidationFailedModal';
import { useI18n } from '../hooks/useI18n';
import { useModal } from '../hooks/useModal';
import { ComponentName } from '../constants';

const addBankAccountSubmit = async data => {
  removeFalsyFromObject(data);
  const res = await postApi<RailsApiResponse<null>>(
    '/railsapi/v1/user/bank',
    data,
  ).catch((err: RailsApiResponse<null>) => err);
  return res.Success || res.Message || false;
};

const Modals = () => {
  const { table } = useI18n();
  const { activeModal } = useModal();
  if (!Object.keys(table()).length) {
    return null;
  }
  return (
    <>
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
