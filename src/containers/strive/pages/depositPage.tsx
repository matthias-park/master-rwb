import React, { useCallback, useMemo, useState, useEffect } from 'react';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import { postApi } from '../../../utils/apiUtils';
import {
  DepositLimits,
  DepositRequest,
  DepositResponse,
  DepositStatus,
} from '../../../types/api/user/Deposit';
import { useI18n } from '../../../hooks/useI18n';
import { PagesName } from '../../../constants';
import CustomAlert from '../components/CustomAlert';
import { useRoutePath } from '../../../hooks';
import { useAuth } from '../../../hooks/useAuth';
import { VALIDATOR_STATUS } from '../../../types/UserStatus';
import useDepositResponseStatus from '../../../hooks/useDepositResponseStatus';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useGTM from '../../../hooks/useGTM';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useApi from '../../../hooks/useApi';
import DepositForm from '../components/account-settings/DepositForm';

const DepositPage = () => {
  const { user } = useAuth();
  const { t, jsxT } = useI18n();
  const { data: depositData, error: depositError } = useApi<
    RailsApiResponse<DepositLimits[] | null>
  >('/restapi/v1/user/max_deposit');
  const depositDataLoading = !depositData && !depositError;
  const [depositLoading, setDepositLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const depositBaseUrl = useRoutePath(PagesName.DepositPage, true);
  const depositStatus = useDepositResponseStatus();
  const sendDataToGTM = useGTM();
  useEffect(() => {
    if (
      [DepositStatus.Confirmed, DepositStatus.Rejected].includes(
        depositStatus.depositStatus,
      )
    ) {
      sendDataToGTM({
        event: 'depositStatusChange',
        'tglab.deposit.success':
          depositStatus.depositStatus === DepositStatus.Confirmed,
      });
    }
  }, [depositStatus.depositStatus]);

  const questionItems = useMemo(
    () => [
      { title: t('deposit_question_1'), body: t('deposit_answer_1') },
      { title: t('deposit_question_2'), body: t('deposit_answer_2') },
    ],
    [t],
  );

  const handleRequestDeposit = useCallback(
    async (depositValue: number, bankId: number) => {
      setApiError(null);
      setDepositLoading(true);
      const depositParams: DepositRequest = {
        BankId: bankId,
        Amount: depositValue,
        ReturnSuccessUrl: `${window.location.origin}${depositBaseUrl}/loading`,
        ReturnCancelUrl: `${window.location.origin}${depositBaseUrl}/cancel`,
      };
      const response: RailsApiResponse<DepositResponse | null> = await postApi<
        RailsApiResponse<DepositResponse>
      >('/railsapi/v1/deposits/perform', depositParams).catch(
        (res: RailsApiResponse<null>) => {
          return res;
        },
      );
      if (
        response?.Success &&
        response.Data?.RedirectUrl &&
        response.Data?.DepositRequestId
      ) {
        depositStatus.setDepositId(response.Data.DepositRequestId);
        return !!(window.location.href = response.Data.RedirectUrl);
      }
      if (!response || !response.Success || response.Message) {
        setApiError(response?.Message || t('api_response_failed'));
      }
      setDepositLoading(false);
      return false;
    },
    [],
  );

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{jsxT('deposit_page_title')}</h1>
      <p className="mb-4">{jsxT('deposit_page_sub_text')}</p>
      <div className="play-responsible-block mb-3 px-2">
        <i className="icon-thumbs"></i>
        {jsxT('play_responsible_block_link')}
      </div>
      <CustomAlert show={!!apiError} variant="danger">
        {apiError}
      </CustomAlert>
      <LoadingSpinner
        show={
          depositStatus.depositStatus === DepositStatus.Pending ||
          depositDataLoading
        }
        className="d-block mx-auto my-4"
      />
      <CustomAlert
        show={
          ![DepositStatus.Pending, DepositStatus.None].includes(
            depositStatus.depositStatus,
          )
        }
        variant={
          depositStatus.depositStatus === DepositStatus.Confirmed
            ? 'success'
            : 'danger'
        }
      >
        {depositStatus.message}
        <div>
          <u>
            {depositStatus.depositStatus === DepositStatus.Confirmed
              ? jsxT('cta_bet_now')
              : jsxT('cta_deposit')}
          </u>
        </div>
      </CustomAlert>
      <DepositForm
        depositRequest={handleRequestDeposit}
        disabled={
          user.validator_status === VALIDATOR_STATUS.MAJOR_ERROR ||
          depositStatus.depositStatus === DepositStatus.Pending ||
          depositDataLoading
        }
        loading={depositLoading}
        setApiError={setApiError}
        depositData={depositData}
        depositError={!!depositError}
      />
      <QuestionsContainer items={questionItems} />
      <HelpBlock
        title={'user_help_title'}
        blocks={['faq', 'phone', 'email']}
        className="d-block d-xl-none"
      />
    </main>
  );
};

export default DepositPage;
