import React, { useEffect, useState } from 'react';
import GenericModal from './GenericModal';
import { useI18n } from '../../../../hooks/useI18n';
import { useConfig } from '../../../../hooks/useConfig';
import { ComponentName, PagesName } from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import { useAuth } from '../../../../hooks/useAuth';
import { useRoutePath } from '../../../../hooks/index';
import { useLocation } from 'react-router';
import { getApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import LoadingButton from '../../../../components/LoadingButton';
import CustomAlert from '../CustomAlert';
import CheckboxInput from '../../../../components/customFormInputs/CheckboxInput';
import { useForm, FormProvider } from 'react-hook-form';
import { replaceStringTagsReact } from '../../../../utils/reactUtils';

enum LoadingBtnState {
  None,
  Accept,
  Logout,
}

const TermsAndConditionsModal = () => {
  const { user, signout, updateUser } = useAuth();
  const { jsxT, t } = useI18n();
  const { activeModal, enableModal, disableModal } = useModal();
  const { pathname } = useLocation();
  const modalActive = activeModal === ComponentName.TermsAndConditionsModal;
  const hideModal = () => disableModal(ComponentName.TermsAndConditionsModal);
  const [apiError, setApiError] = useState<string | null>(null);
  const formMethods = useForm({
    mode: 'onChange',
  });
  const { handleSubmit, watch } = formMethods;
  const watchTncCheckbox = watch('tnc_checkbox');
  const [loadingBtn, setLoadingBtn] = useState<LoadingBtnState>(
    LoadingBtnState.None,
  );
  const termsAndConditionsPath = useRoutePath(
    PagesName.TermsAndConditionsPage,
    true,
  );

  useEffect(() => {
    if (!modalActive && user.logged_in && user.tnc_required) {
      enableModal(ComponentName.TermsAndConditionsModal);
    } else if (!user.logged_in || !user.tnc_required) {
      hideModal();
      formMethods.reset();
      setLoadingBtn(LoadingBtnState.None);
    }
  }, [modalActive, user, pathname, termsAndConditionsPath]);

  const acceptHandler = async () => {
    setLoadingBtn(LoadingBtnState.Accept);
    const result = await getApi<RailsApiResponse<{}>>(
      '/railsapi/v1/user/accept_tnc',
    ).catch(err => err);
    if (result.Success) {
      updateUser();
      enableModal(ComponentName.ResponsibleGamblingModal);
    } else {
      setApiError(result.Message || t('terms_and_cond_modal_api_error'));
      setLoadingBtn(LoadingBtnState.None);
    }
  };

  const logout = async () => {
    setLoadingBtn(LoadingBtnState.Logout);
    await signout();
    setLoadingBtn(LoadingBtnState.None);
  };
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);

  return (
    <GenericModal
      show={modalActive && pathname !== termsAndConditionsPath}
      hideCallback={hideModal}
      isCentered
      isStatic
      withoutClose
      className="pb-4"
    >
      <h2 className="mb-4 text-center">{t('terms_and_cond_modal_title')}</h2>
      <CustomAlert show={!!apiError} variant="danger" className="mt-2">
        {apiError!}
      </CustomAlert>
      <div className="my-3">{replaceStringTagsReact(t('tnc_info_text'))}</div>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(acceptHandler)}>
          <CheckboxInput
            id={'tnc_checkbox'}
            title={jsxT('terms_and_cond_modal_body')}
            defaultValue={false}
            rules={{
              required: t('tnc_checkbox_required'),
            }}
          />
          <div className="d-flex justify-content-center flex-wrap mt-3">
            <LoadingButton
              disabled={!watchTncCheckbox}
              loading={loadingBtn === LoadingBtnState.Accept}
              variant="primary"
              className="mt-2"
              type="submit"
            >
              {t('terms_and_cond_modal_accept')}
            </LoadingButton>
            <LoadingButton
              onClick={logout}
              disabled={loadingBtn !== LoadingBtnState.None}
              loading={loadingBtn === LoadingBtnState.Logout}
              variant="primary"
              className="ml-1 mt-2"
            >
              {t('terms_and_cond_modal_logout')}
            </LoadingButton>
          </div>
        </form>
      </FormProvider>
      <div className="custom-modal__footer">
        <div className="custom-modal__footer-bnl mx-auto">
          <img
            alt="bnl-restrictions"
            height="45"
            className="mr-2"
            src={`/assets/images/restrictions/bnl-${locale}.svg`}
          />
        </div>
      </div>
    </GenericModal>
  );
};

export default TermsAndConditionsModal;
