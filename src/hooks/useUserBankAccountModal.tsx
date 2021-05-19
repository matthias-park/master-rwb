import useSWR from 'swr';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { UserBankAccount } from '../types/UserStatus';

const useUserBankAccountModal = () => {
  const { data, error, mutate } = useSWR<RailsApiResponse<UserBankAccount>>(
    '/railsapi/v1/user/bank',
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  const loading = !data && !error;
  const hasBankAccount = data?.Data.bank_account ?? false;
  const requestError =
    (!loading && data?.Data.bank_account === undefined) || !!error;
  return {
    loading,
    hasBankAccount,
    error: requestError,
    refresh: mutate,
  };
};

export default useUserBankAccountModal;
