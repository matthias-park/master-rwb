import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import { Spinner } from 'react-bootstrap';
import { postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useAuth } from '../../../../hooks/useAuth';
import dayjs from 'dayjs';
import { franchiseDateFormat } from '../../../../constants';
import useApi from '../../../../hooks/useApi';
import LoadingButton from '../../../../components/LoadingButton';

const LimitsReaffirmationModal = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { activeModal, disableModal, enableModal } = useModal();
  const hideModal = () => disableModal(ComponentName.LimitsReaffirmationModal);
  const { data, error, mutate } = useApi<any>([
    user.logged_in ? '/railsapi/v1/user/profile/active_limit_requests' : null,
    user.id,
  ]);
  const isDataLoading = !data && !error;
  const [isLimitLoading, setIsLimitLoading] = useState<string | false>(false);

  useEffect(() => {
    if (user.logged_in && !!data?.Data?.length) {
      enableModal(ComponentName.LimitsReaffirmationModal);
    } else {
      disableModal(ComponentName.LimitsReaffirmationModal);
    }
  }, [user.logged_in, data]);

  const activate = async (activationCode, type) => {
    if (!isLimitLoading) {
      setIsLimitLoading(activationCode);
      const resp = await postApi<RailsApiResponse<any>>(
        '/railsapi/v1/user/settings/activate_requested_limit',
        {
          activation_code: activationCode,
          type: type,
        },
      ).catch(err => err);
      if (resp.Success) {
        mutate();
      }
      setIsLimitLoading(false);
    }
  };

  const cancel = async (activationCode, type) => {
    if (!isLimitLoading) {
      setIsLimitLoading(activationCode);
      const resp = await postApi<RailsApiResponse<any>>(
        '/railsapi/v1/user/settings/cancel_requested_limit',
        {
          activation_code: activationCode,
          type: type,
        },
      ).catch(err => err);
      if (resp.Success) {
        mutate();
      }
      setIsLimitLoading(false);
    }
  };

  return (
    <GenericModal
      isCentered
      show={activeModal === ComponentName.LimitsReaffirmationModal}
      hideCallback={() => hideModal()}
      className="limits-reaffirmation-modal"
    >
      <div className="d-flex justify-content-center flex-column">
        <h2>{t('limits_reaffirmation_title')}</h2>
        {isDataLoading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" className="spinner-custom mx-auto" />
          </div>
        )}
        {!isDataLoading && (
          <>
            {data?.Data?.map(
              (limit: {
                Action: string;
                ActivationCode: string;
                Amount: number;
                Period: string;
                PlayerId: number;
                RequestedDate: string;
                Type: number;
                TypeName: string;
              }) => (
                <ul className="limits">
                  <li className="limits__limit">
                    <div className="limits__limit-info">
                      <p>{limit.TypeName}</p>
                      <small>{`${t('deposit_limit_period')}: ${
                        limit.Period
                      }`}</small>
                      <small>{`${t('limit_amount')}: ${user.currency}${
                        limit.Amount
                      }`}</small>
                      <small>{`${t('future_from_limit')}: ${dayjs(
                        limit.RequestedDate,
                      ).format(franchiseDateFormat)}`}</small>
                    </div>
                    <div className="limits__limit-actions">
                      <LoadingButton
                        size="sm"
                        className="mr-2"
                        onClick={() =>
                          activate(limit.ActivationCode, limit.Type)
                        }
                        loading={isLimitLoading === limit.ActivationCode}
                      >
                        Accept
                      </LoadingButton>
                      <LoadingButton
                        size="sm"
                        variant="secondary"
                        onClick={() => cancel(limit.ActivationCode, limit.Type)}
                        loading={isLimitLoading === limit.ActivationCode}
                      >
                        Cancel
                      </LoadingButton>
                    </div>
                  </li>
                </ul>
              ),
            )}
          </>
        )}
      </div>
    </GenericModal>
  );
};

export default LimitsReaffirmationModal;
