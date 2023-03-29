import React from 'react';
import { useI18n } from '../../../hooks/useI18n';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import ChangePassword2fa from '../components/account-settings/ChangePassword2fa';
import ChangePasswordForm from '../components/account-settings/ChangePasswordForm';

const questionItems = [
  {
    title: 'change_password_question_1',
    body: 'change_password_answer_1',
  },
  {
    title: 'change_password_question_2',
    body: 'change_password_answer_2',
  },
];

const ChangePasswordPage = () => {
  const { t, jsxT } = useI18n();

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title">
        {jsxT('change_password_page_title')}
      </h1>
      <p className="account-settings__sub-text">
        {t('change_password_sub_text')}
      </p>
      <div className="outer-info-block change-pw">
        <ChangePasswordForm />
        <ChangePassword2fa />
      </div>
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['faq', 'phone', 'email']}
        className="d-block d-xl-none"
      />
    </main>
  );
};

export default ChangePasswordPage;
