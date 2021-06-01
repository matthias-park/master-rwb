import React, { useCallback, useMemo, useState, useEffect } from 'react';
import InputContainer from '../components/account-settings/InputContainer';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import { postApi } from '../../../utils/apiUtils';
import {
  DepositRequest,
  DepositResponse,
  DepositStatus,
} from '../../../types/api/user/Deposit';
import { useToasts } from 'react-toast-notifications';
import { useI18n } from '../../../hooks/useI18n';
import { ComponentName, PagesName } from '../../../constants';
import CustomAlert from '../components/CustomAlert';
import useUserBankAccountModal from '../../../hooks/useUserBankAccountModal';
import { usePrevious, useRoutePath } from '../../../hooks';
import { useModal } from '../../../hooks/useModal';
import { useAuth } from '../../../hooks/useAuth';
import { VALIDATOR_STATUS } from '../../../types/UserStatus';
import { structuredBankCommunications } from '../../../utils/index';
import Spinner from 'react-bootstrap/Spinner';
import useDepositResponseStatus from '../../../hooks/useDepositResponseStatus';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useGTM from '../../../hooks/useGTM';

const DepositPage = () => {
  const { addToast } = useToasts();
  const { user } = useAuth();
  const bankAccount = useUserBankAccountModal();
  const { enableModal, allActiveModals } = useModal();
  const { t, jsxT } = useI18n();
  const [depositLoading, setDepositLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const depositBaseUrl = useRoutePath(PagesName.DepositPage, true);
  const depositStatus = useDepositResponseStatus();
  const addBankAccountModalActivePrevious = usePrevious(
    allActiveModals.includes(ComponentName.AddBankAccountModal),
  );
  const sendDataToGTM = useGTM();

  useEffect(() => {
    if (
      user.logged_in &&
      user.validator_status !== VALIDATOR_STATUS.MAJOR_ERROR &&
      !bankAccount.loading &&
      !bankAccount.hasBankAccount &&
      !bankAccount.error
    ) {
      enableModal(ComponentName.AddBankAccountModal);
    }
  }, [bankAccount.loading]);
  useEffect(() => {
    if (
      !allActiveModals.includes(ComponentName.AddBankAccountModal) &&
      addBankAccountModalActivePrevious
    ) {
      bankAccount.refresh();
    }
  }, [allActiveModals]);
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
    async (depositValue: number) => {
      setApiError(null);
      if (!bankAccount.loading && !bankAccount.hasBankAccount) {
        addToast(`No bank account`, {
          appearance: 'error',
          autoDismiss: true,
        });
        return;
      }
      setDepositLoading(true);
      const depositParams: DepositRequest = {
        BankId: 160,
        Amount: depositValue,
        ReturnSuccessUrl: `${window.location.origin}${depositBaseUrl}/loading`,
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
    [bankAccount],
  );

  const minDeposit = t('bancontact_min_deposit');
  const maxDeposit =
    user.max_deposit !== null ? user.max_deposit : t('bancontact_max_deposit');
  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{jsxT('deposit_page_title')}</h1>
      <p className="mb-4">{jsxT('deposit_page_sub_text')}</p>
      <div className="play-responsible-block mb-3 px-2">
        <i className="icon-thumbs"></i>
        {jsxT('play_responsible_block_link')}
      </div>
      {/* <AmountContainer
        title={t('total_playable_amount')}
        amount={user.balance!}
        tooltip={t('playable_amount_tooltip')}
      /> */}
      <CustomAlert show={!!apiError || !!bankAccount.error} variant="danger">
        {apiError ? apiError : jsxT('user_bank_acc_check_failed')}
      </CustomAlert>
      {depositStatus.depositStatus !== DepositStatus.None &&
        (depositStatus.depositStatus === DepositStatus.Pending ? (
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
            className="d-block mx-auto my-4"
          />
        ) : (
          <CustomAlert
            show={true}
            variant={
              depositStatus.depositStatus === DepositStatus.Confirmed
                ? 'success'
                : 'danger'
            }
          >
            {depositStatus.message ||
              jsxT(`deposit_status_${depositStatus.depositStatus}`)}
            <div>
              <u>
                {depositStatus.depositStatus === DepositStatus.Confirmed
                  ? jsxT('cta_bet_now')
                  : jsxT('cta_deposit')}
              </u>
            </div>
          </CustomAlert>
        ))}
      <InputContainer
        title={t('select_amount')}
        inputTitle={t('deposit_input_amount')}
        defaultValue="0"
        buttonText={
          <>
            <i className="icon-lock1 text-brand mr-1"></i>
            {t('deposit_btn')}
          </>
        }
        buttonClassName="mx-auto my-2"
        validationErrorPrefix="deposit_"
        min={minDeposit}
        max={maxDeposit}
        loading={depositLoading}
        onSubmit={handleRequestDeposit}
        quickAmounts={[10, 20, 50, 100]}
        currency={user.currency}
        subText={`${t('min_deposit')}: ${minDeposit} ${user.currency} - ${t(
          'max_deposit',
        )}: ${maxDeposit} ${user.currency}`}
        header={
          <div className="input-container__header d-flex align-items-center">
            <img
              alt="bancontact"
              height="45"
              src={`/assets/images/banks/bancontact.png`}
            />
            <h2 className="ml-3 mb-0">{t('deposit_input_container_title')}</h2>
          </div>
        }
        disabled={
          !bankAccount.hasBankAccount ||
          user.validator_status === VALIDATOR_STATUS.MAJOR_ERROR ||
          depositStatus.depositStatus === DepositStatus.Pending
        }
      />
      <div className="details-container mb-4">
        <div className="details-container__header">
          <i className="icon-payment-of-wins mr-2">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <h2 className="mb-0">{jsxT('deposit_to_bank_title')}</h2>
        </div>
        <div className="details-container__body">
          <p className="mb-3">{t('deposit_to_bank_info')}</p>
          <ul className="list-unstyled mb-0">
            <li className="mb-2 d-flex flex-column flex-sm-row">
              <span className="font-weight-bold">
                {t('deposit_max_amount')}:{' '}
              </span>
              <span className="ml-sm-auto">
                {user?.max_deposit} {user.currency}
              </span>
            </li>
            <li className="mb-2 d-flex flex-column flex-sm-row">
              <span className="font-weight-bold">{t('deposit_iban')}: </span>
              <span className="ml-sm-auto">{t('deposit_bank_iban_data')}</span>
            </li>
            <li className="mb-2 d-flex flex-column flex-sm-row">
              <span className="font-weight-bold">
                {t('deposit_bank_code')}:{' '}
              </span>
              <span className="ml-sm-auto">{t('deposit_bank_code_data')}</span>
            </li>
            <li className="mb-2 d-flex flex-column flex-sm-row">
              <span className="font-weight-bold">
                {t('deposit_bank_title')}:{' '}
              </span>
              <span className="ml-sm-auto">{t('deposit_bank_title_data')}</span>
            </li>
            <li className="mb-2 d-flex flex-column flex-sm-row">
              <span className="font-weight-bold">
                {t('deposit_bank_communications')}:{' '}
              </span>
              <span className="ml-sm-auto">
                {structuredBankCommunications(user?.barcode)}
              </span>
            </li>
          </ul>
          <div className="details-mention-block mt-4">
            <i className="icon-arrow-label">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            {t('deposit_to_bank_mention')}
          </div>
        </div>
      </div>
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
