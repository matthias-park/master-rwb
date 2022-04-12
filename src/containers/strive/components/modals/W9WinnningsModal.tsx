import React from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import { Button, Form } from 'react-bootstrap';
import useApi from '../../../../hooks/useApi';
import { useAuth } from '../../../../hooks/useAuth';
import CustomToggleCheck from '../CustomToggleCheck';
import { FormProvider, useForm } from 'react-hook-form';
import { getApi, postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { NET_USER } from '../../../../types/UserStatus';
import LoadingButton from '../../../../components/LoadingButton';
import { useLocation } from 'react-router-dom';
import { useConfig } from '../../../../hooks/useConfig';
import Lockr from 'lockr';
import useOnUnload from '../../../../hooks/useOnUnload';

const W9WinningsModal = () => {
  const { t, jsxT } = useI18n();
  const { activeModal, disableModal, enableModal } = useModal();
  const formMethods = useForm();
  const { formState, register, handleSubmit, watch } = formMethods;
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { routes } = useConfig();

  const onClaimPolicyRoute = !!routes
    .find(route => route.path === pathname)
    ?.hideModals?.includes(ComponentName.W9WinningsModal);

  const modalActive = activeModal === ComponentName.W9WinningsModal;
  const hideModal = () => disableModal(ComponentName.W9WinningsModal);

  const refreshed = Lockr.get('winnings-refresh-tracker');
  useOnUnload(() => {
    Lockr.set('winnings-refresh-tracker', true);
  });

  const { data } = useApi(
    !refreshed && user.logged_in ? '/railsapi/v2/user/w9_status' : null,
    url =>
      getApi<RailsApiResponse<{ Amount: number }[]>>(url, {
        cache: 'no-store',
      }).then(data => {
        if (!!data?.Data.length) {
          let winnings = 0;
          data?.Data.forEach(bet => {
            winnings += bet.Amount;
          });
          enableModal(ComponentName.W9WinningsModal);
          return `${user.currency}${Math.round(winnings * 100) / 100}`;
        } else {
          return '';
        }
      }),
    {
      dedupingInterval: 5000,
    },
  );

  const onSubmit = async () => {
    const res = await postApi<RailsApiResponse<NET_USER>>(
      '/restapi/v1/user/set_w9_status',
      {
        w9_approved: true,
      },
    );
    if (res.Success) {
      hideModal();
    }
  };

  if (!modalActive || !data || onClaimPolicyRoute) return null;
  return (
    <GenericModal
      isStatic
      isCentered
      show
      hideCallback={hideModal}
      className="pb-5"
    >
      <h2 className="mb-2 text-center">{t('winnings_pop_up_title')}</h2>
      <h4 className="mb-3 text-center">{data}</h4>
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <CustomToggleCheck
            {...register('correct_user', {
              required: 'correct_user',
            })}
            checked={watch('correct_user')}
            id="correct_user"
            label={jsxT('winnings_pop_up_correct_user')}
            className="mt-3"
          />
          <CustomToggleCheck
            {...register('us_citizen', {
              required: 'us_citizen',
            })}
            checked={watch('us_citizen')}
            label={jsxT('winnings_pop_up_us_citizen')}
            id="us_citizen"
          />
          <p className="my-0 mx-auto text-center small w-75">
            {jsxT('winnings_pop_up_irs')}
          </p>
          <div className="d-flex justify-content-between mt-3 px-3 flex-wrap flex-sm-nowrap">
            <Button onClick={hideModal} className="m-1 w-100">
              {t('winnings_pop_up_close_btn')}
            </Button>
            <LoadingButton
              data-testid="button"
              loading={formState.isSubmitting}
              disabled={watch(['correct_user', 'us_citizen']).some(v => !v)}
              className="w-100 m-1"
              type="submit"
            >
              {t('winnings_pop_up_submit_btn')}
            </LoadingButton>
          </div>
        </Form>
      </FormProvider>
    </GenericModal>
  );
};

export default W9WinningsModal;
