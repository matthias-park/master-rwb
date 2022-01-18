import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import useApi from './useApi';
import { useAuth } from './useAuth';
import { useLocation, useHistory } from 'react-router';
import useLocalStorage from './useLocalStorage';

type CompletedActions = {
  documentsAdded?: boolean;
  maxBalanceAdded?: boolean;
  bankAdded?: boolean;
  depositLimitCountAdded?: boolean;
  sessionLimitAdded?: boolean;
};

export const RegisterContext = React.createContext<{
  checkRegData: {};
  completedActions: CompletedActions;
  isRegDataLoading: boolean;
  registrationIncomplete: boolean | undefined;
  updateCompletedActions: Dispatch<SetStateAction<CompletedActions>>;
}>({
  checkRegData: {},
  completedActions: {} as CompletedActions,
  isRegDataLoading: true,
  registrationIncomplete: false,
  updateCompletedActions: () => null,
});

export const useCompleteRegistration = () => {
  const instance = useContext(RegisterContext);
  if (!instance) {
    throw new Error('There was an error getting instance from context');
  }
  return instance;
};

export const CompleteRegistrationProvider = props => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const history = useHistory();

  const userActivated = user.logged_in && !user.registration_id;
  const { data: limits } = useApi(
    userActivated ? '/restapi/v1/user/profile/play_limits' : null,
  );
  const { data: maxBalance } = useApi(
    userActivated ? '/restapi/v1/user/max_balance_limit' : null,
  );
  const { data: banks } = useApi<any>(
    userActivated ? '/restapi/v1/user/bank' : null,
  );
  const { data: documents } = useApi<any>(
    userActivated ? '/restapi/v1/user/profile/required_documents' : null,
  );

  const [completedActions, setCompletedActions] = useState<CompletedActions>({
    sessionLimitAdded: false,
    documentsAdded: false,
    maxBalanceAdded: false,
    bankAdded: false,
    depositLimitCountAdded: false,
  });

  const [isDataLoading, setIsDataLoading] = useState(
    [limits, maxBalance, documents].every(item => !item),
  );

  const [
    registrationIncomplete,
    setRegistrationIncomplete,
  ] = useLocalStorage<null | {
    status?: boolean | undefined;
    id?: number | undefined;
  }>('registration-incomplete', null);

  useEffect(() => {
    const incomplete = !Object.values(completedActions).every(v => v);
    if (!incomplete && pathname.includes('complete-registration')) {
      setRegistrationIncomplete({
        id: registrationIncomplete?.id,
        status: false,
      });
      history.push('/');
    }
    setIsDataLoading([limits, maxBalance, documents].every(item => !item));
  }, [completedActions]);

  useEffect(() => {
    if (user.logged_in && !user.loading) {
      setCompletedActions(prevState => {
        const documentsAdded = documents?.documents.some(document => {
          return document.uploaded.length > 0 && document.id === 'image_id';
        });
        const depositLimitsAdded = !!limits?.limits.filter(
          limit => limit.id === 'deposit_limit_count',
        )[0]?.data.length;
        const sessionLimitsAdded = !!limits?.limits.filter(
          limit => limit.id === 'session_limit',
        )[0]?.data.length;
        return {
          sessionLimitAdded: prevState.sessionLimitAdded || sessionLimitsAdded,
          maxBalanceAdded:
            prevState.maxBalanceAdded || !!maxBalance?.Data?.data,
          documentsAdded: documentsAdded,
          bankAdded: prevState.bankAdded || !!banks?.Data.bank_account,
          depositLimitCountAdded:
            prevState.depositLimitCountAdded || depositLimitsAdded,
        };
      });

      if (user.id !== registrationIncomplete?.id) {
        setRegistrationIncomplete({
          id: user?.id,
          status: true,
        });
      }
    } else {
      setCompletedActions({
        sessionLimitAdded: false,
        documentsAdded: false,
        maxBalanceAdded: false,
        bankAdded: false,
        depositLimitCountAdded: false,
      });
    }
  }, [limits, maxBalance, banks, documents]);

  return (
    <RegisterContext.Provider
      value={{
        checkRegData: {
          limits: limits,
          maxBalance: maxBalance,
          banks: banks,
          documents: documents,
        },
        completedActions: completedActions,
        isRegDataLoading: isDataLoading,
        registrationIncomplete: registrationIncomplete?.status,
        updateCompletedActions: setCompletedActions,
      }}
    >
      {props.children}
    </RegisterContext.Provider>
  );
};
