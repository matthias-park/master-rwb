import React from 'react';
import Link from '../../../components/Link';
import { PagesName, ThemeSettings } from '../../../constants';
import { useRoutePath } from '../../../hooks';
import { useI18n } from '../../../hooks/useI18n';
import clsx from 'clsx';

const HelpBlock = ({
  title,
  blocks,
  className,
}: {
  title?: string;
  blocks: string[];
  className?: string;
}) => {
  const { icons: icon } = ThemeSettings!;
  const { t, jsxT } = useI18n();
  const faqPagePath = useRoutePath(PagesName.FaqPage);
  const contactUsPagePath = useRoutePath(PagesName.ContactUsPage);

  return (
    <div className={`help-block ${className}`}>
      {title && <p className="help-block__title">{t(title)}</p>}
      <div className="help-block__body">
        {blocks.includes('faq') && (
          <Link
            to={faqPagePath}
            rel="noreferrer"
            target="_blank"
            className="help-block__body-item"
          >
            <span className="help-block__body-item-icon">
              <i className={clsx(icon?.questions)}></i>
            </span>
            <div className="help-block__body-item-text">
              <p className="title">{jsxT('help_check_faq')}</p>
            </div>
          </Link>
        )}
        {blocks.includes('phone') && (
          <div className="help-block__body-item">
            <span className="help-block__body-item-icon">
              <i className={clsx(icon?.phone)}></i>
            </span>
            <div className="help-block__body-item-text">
              <p className="title">{jsxT('help_call_us_number')}</p>
              <p className="text-14 gray">{jsxT('help_call_us_number_data')}</p>
              {['', '_2', '_3'].map(id => (
                <p key={id} className="text-14 gray">
                  {jsxT(`help_call_days${id}`)}
                  <span className="ml-2 weight-500">
                    {jsxT(`help_call_hours${id}`)}
                  </span>
                </p>
              ))}
            </div>
          </div>
        )}
        {blocks.includes('email') && (
          <Link
            to={contactUsPagePath}
            target="_blank"
            rel="noreferrer"
            className="help-block__body-item"
          >
            <span className="help-block__body-item-icon">
              <i className={clsx(icon?.mail)}></i>
            </span>
            <div className="help-block__body-item-text">
              <p className="title">{jsxT('help_mail_title')}</p>
              <p className="text-14 gray">{jsxT('help_mail_description')}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HelpBlock;
