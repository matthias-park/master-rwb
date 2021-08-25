import useSWR from 'swr';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { UserBankAccount } from '../types/UserStatus';
import { useAuth } from './useAuth';

const useUserBankAccountModal = () => {
  const { user } = useAuth();
  const { data, error, mutate } = useSWR<RailsApiResponse<UserBankAccount>>(
    user.logged_in ? ['/restapi/v1/user/bank', user.id] : null,
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
