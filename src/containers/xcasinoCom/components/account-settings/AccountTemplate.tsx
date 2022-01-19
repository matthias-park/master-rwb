import clsx from 'clsx';
import React from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { replaceStringTagsReact } from '../../../../utils/reactUtils';
import Main from '../../pageLayout/Main';

interface AccountPageTemplateProps {
  title: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

const AccountPageTemplate = ({
  title,
  text,
  className,
  children,
}: AccountPageTemplateProps) => {
  const { t } = useI18n();
  const isHtml = /<(\/)?(\w)*(\d)?\>/.test(String(text));
  return (
    <Main title={t('account_pages_title')} icon="icon-account">
      <div className="account-page fade-in">
        <div className="account-page__header">
          <h4 className="account-page__header-title">{title}</h4>
          {isHtml ? (
            replaceStringTagsReact(String(text))
          ) : (
            <p className="account-page__header-text">{text}</p>
          )}
        </div>
        <div className={clsx('account-page__content', className)}>
          {children}
        </div>
      </div>
    </Main>
  );
};

export default AccountPageTemplate;
