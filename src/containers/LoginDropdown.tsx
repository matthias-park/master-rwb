import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { postApi } from '../utils/apiUtils';
import { useConfig } from '../hooks/useConfig';
import Dropdown from 'react-bootstrap/Dropdown';
import { useUIConfig } from '../hooks/useUIConfig';
import { ComponentName, FormFieldValidation, PagesName } from '../constants';
import { useI18n } from '../hooks/useI18n';
import { useLocation } from 'react-router-dom';
import CustomAlert from '../components/CustomAlert';
import { Spinner, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { useRoutePath } from '../hooks/index';
import { NET_USER } from '../types/UserStatus';
import { ControlledTextInput } from '../components/TextInput';
import RailsApiResponse from '../types/api/RailsApiResponse';
import useGTM from '../hooks/useGTM';
import LoadingButton from '../components/LoadingButton';
import Link from '../components/Link';
import { useModal } from '../hooks/useModal';

interface Props {
  dropdownClasses?: string;
  toggleClasses?: string;
  userLoading?: boolean;
}

const LoginForm = ({
  hideLoginDropdown,
}: {
  hideLoginDropdown: () => void;
}) => {
  const { t } = useI18n();
  const [apiError, setApiError] = useState<string | null>(null);
  const { enableModal } = useModal();
  const formMethods = useForm<{
    email: string;
    password: string;
    remember_me: boolean;
  }>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  });
  const { register, handleSubmit, formState, watch } = formMethods;
  const { mutateUser } = useConfig();
  const sendDataToGTM = useGTM();
  const forgotPasswordRoute = useRoutePath(PagesName.ForgotPasswordPage);
  const onSubmit = async ({ email, password, remember_me }) => {
    setApiError(null);
    sendDataToGTM({
      event: 'LoginSubmitted',
    });
    const response = await postApi<RailsApiResponse<NET_USER | null>>(
      '/railsapi/v1/user/login',
      {
        login: email.trim(),
        password,
        remember_me,
      },
    ).catch((res: RailsApiResponse<null>) => res);
    if (response.Success && response.Data?.PlayerId) {
      hideLoginDropdown();
      sendDataToGTM({
        'tglab.GUID': response.Data.PlayerId!,
        event: 'SuccessfulLogin',
      });
      enableModal(ComponentName.ResponsibleGamblingModal);
      return mutateUser(
        {
          id: response.Data.PlayerId,
          balance: response.Data.Balance.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }),
          logged_in: true,
          loading: false,
          name: response.Data.Login,
        },
        true,
      );
    }
    sendDataToGTM({
      'tglab.Error': response.Message || t('login_failed_to_login'),
      event: 'LoginFailed',
    });
    setApiError(response.Message || t('login_failed_to_login'));
    return;
  };
  return (
    <FormProvider {...formMethods}>
      <Form
        className="pb-4 mb-4 login-dropdown__menu-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CustomAlert
          show={formState.isSubmitted && !!apiError}
          variant="danger"
        >
          <div dangerouslySetInnerHTML={{ __html: apiError || '' }} />
        </CustomAlert>
        <ControlledTextInput
          rules={{
            validate: value => !!value.trim() || t('login_field_required'),
          }}
          id="email"
          // type="email"
          placeholder={t('login_email')}
          autoComplete="username"
          validation={apiError ? FormFieldValidation.Invalid : undefined}
          error={formState.errors.email}
        />
        <ControlledTextInput
          rules={{
            validate: value => !!value.trim() || t('login_password_required'),
          }}
          validation={apiError ? FormFieldValidation.Invalid : undefined}
          id="password"
          type={'password'}
          placeholder={t('login_password')}
          autoComplete="current-password"
          toggleVisibility
          error={formState.errors.password}
        />
        <div className="d-flex align-items-center flex-wrap">
          <Form.Check
            {...register('remember_me', { setValueAs: value => !!value })}
            custom
            id="remember_me"
            name="remember_me"
            label={t('login_remember_me')}
          />
          <OverlayTrigger
            placement={'bottom'}
            overlay={
              <Tooltip id="tooltip_remember" className="tooltip-custom">
                Tooltip for remember me
              </Tooltip>
            }
          >
            <i className="icon-tooltip ml-2"></i>
          </OverlayTrigger>
          <Link
            to={forgotPasswordRoute}
            className="text-14 ml-auto login-dropdown__menu-link"
          >
            <u>{t('login_forgot_password')}</u>
          </Link>
        </div>
        <LoadingButton
          disabled={!formState.isDirty || !watch('email') || !watch('password')}
          className="btn btn-primary d-block mx-auto mt-4 px-5"
          type="submit"
          loading={formState.isSubmitting}
        >
          {t('login_submit')}
        </LoadingButton>
      </Form>
    </FormProvider>
  );
};

// const JoinLotteryClub = () => {
//   const { t } = useI18n();
//   return (
//     <div className="lottery-club">
//       <div className="lottery-club__image mr-2">
//         <img
//           src="/assets/images/lottery-club/logo.png"
//           width="90"
//           height="64"
//           alt=""
//         />
//       </div>
//       <div className="lottery-club__text">
//         <p className="text-14">{t('login_dont_have_lottery_acc')}</p>
//         <a href="#" className="text-14">
//           <u>
//             <strong>{t('login_register_with_card')}</strong>
//           </u>
//         </a>
//       </div>
//     </div>
//   );
// };

const RegistrationLink = () => {
  const { t } = useI18n();
  return (
    <div className="d-flex flex-column align-items-center">
      {/* <p className="weight-500 mt-3">{t('login_dont_have_acc')}</p> */}
      <Link to="/register" className="btn btn-outline-brand my-2">
        {t('login_registration_link')}
      </Link>
      {/* <a href="#" className="d-block text-14 mt-2 mb-2">
        <u>
          <strong>{t('login_find_out_lottery')}</strong>
        </u>
      </a> */}
    </div>
  );
};

const LoginDropdown = ({
  dropdownClasses,
  toggleClasses,
  userLoading,
}: Props) => {
  const { t } = useI18n();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { backdrop } = useUIConfig();
  const sendDataToGTM = useGTM();
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    backdrop.toggle(showDropdown, [ComponentName.Header]);
  }, [showDropdown]);

  const handleHideDropdown = React.useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);

  const toggleDropdown = isOpen => {
    if (isOpen) {
      sendDataToGTM({
        event: 'LoginIntention',
      });
    }
    setShowDropdown(isOpen);
  };

  return (
    <Dropdown
      className={`login-dropdown ${dropdownClasses}`}
      show={showDropdown}
      onToggle={toggleDropdown}
    >
      <Dropdown.Toggle
        variant="primary"
        className={`dropdown-toggle login-dropdown__toggle ${toggleClasses}`}
        disabled={userLoading}
      >
        {t('login_btn')}
        <i className="icon-account mr-0 ml-2"></i>
        {userLoading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className="ml-1"
          />
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="login-dropdown__menu">
        <LoginForm hideLoginDropdown={handleHideDropdown} />
        {/* <JoinLotteryClub /> */}
        <RegistrationLink />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LoginDropdown;
