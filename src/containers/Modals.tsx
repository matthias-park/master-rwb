import React from 'react';
import ResponsibleGamblingModal from '../components/modals/ResponsibleGamblingModal';
import CookiePolicyModal from '../components/modals/CookiePolicyModal';
import AddBankAccountModal from '../components/modals/AddBankAccountModal';
import { postApi } from '../utils/apiUtils';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { removeFalsyFromObject } from '../utils/index';

const addBankAccountSubmit = async data => {
  removeFalsyFromObject(data);
  const res = await postApi('/railsapi/v1/user/bank', data).catch(
    (err: RailsApiResponse<null>) => err,
  );
  return console.log(res);
};

const Modals = () => {
  return (
    <>
      <ResponsibleGamblingModal />
      <CookiePolicyModal />
      <AddBankAccountModal onSubmit={addBankAccountSubmit} />
    </>
  );
};

export default Modals;
