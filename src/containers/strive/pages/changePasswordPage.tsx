import React, { useMemo } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import ChangePassword2fa from '../components/account-settings/ChangePassword2fa';
import ChangePasswordForm from '../components/account-settings/ChangePasswordForm';

const ChangePasswordPage = () => {
  const { t, jsxT } = useI18n();
  const questionItems = useMemo(
    () => [
      {
        title: t('change_password_question_1'),
        body: t('change_password_answer_1'),
      },
      {
        title: t('change_password_question_2'),
        body: t('change_password_answer_2'),
      },
    ],
    [t],
  );

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{jsxT('change_password_page_title')}</h1>
      <p className="mb-4">{t('change_password_sub_text')}</p>
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
