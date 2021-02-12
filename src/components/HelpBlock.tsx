import React from 'react';
import { useI18n } from '../hooks/useI18n';

const HelpBlock = ({
  title,
  blocks,
  className,
}: {
  title?: string;
  blocks: string[];
  className?: string;
}) => {
  const { t } = useI18n();
  return (
    <div className={`help-block ${className}`}>
      {title && <p className="help-block__title">{title}</p>}
      <div className="help-block__body">
        {blocks.includes('faq') && (
          <div className="help-block__body-item">
            <span className="help-block__body-item-icon">
              <i className="icon-questions"></i>
            </span>
            <div className="help-block__body-item-text">
              <p className="weight-500">{t('help_check_faq')}</p>
            </div>
          </div>
        )}
        {blocks.includes('phone') && (
          <div className="help-block__body-item">
            <span className="help-block__body-item-icon">
              <i className="icon-phone"></i>
            </span>
            <div className="help-block__body-item-text">
              <p className="weight-500">{t('help_call_us_number')}</p>
              <p className="text-14 weight-500 mb-2">
                {t('help_call_us_number_data')}
              </p>
              <p className="text-14 gray">
                {t('help_call_days')}
                <span className="ml-2 weight-500">{t('help_call_hours')}</span>
              </p>
              <p className="text-14 gray">
                {t('help_call_days_2')}
                <span className=" ml-2 weight-500">
                  {t('help_call_hours_2')}
                </span>
              </p>
            </div>
          </div>
        )}
        {blocks.includes('email') && (
          <div className="help-block__body-item">
            <span className="help-block__body-item-icon">
              <i className="icon-mail"></i>
            </span>
            <div className="help-block__body-item-text">
              <p className="weight-500">{t('help_mail_title')}</p>
              <p className="text-14 gray">{t('help_mail_description')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpBlock;
