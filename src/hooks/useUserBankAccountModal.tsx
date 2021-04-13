import useSWR from 'swr';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { UserBankAccount } from '../types/UserStatus';

const useUserBankAccountModal = () => {
  const { data, error } = useSWR<RailsApiResponse<UserBankAccount>>(
    '/railsapi/v1/user/bank',
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    loading: !data && !error,
    hasBankAccount: !!data?.Data.bank_account,
  };
};

export default useUserBankAccountModal;