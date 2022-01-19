import React from 'react';
import { Button } from 'react-bootstrap';
import { useI18n } from '../../../hooks/useI18n';
import { replaceStringTagsReact } from '../../../utils/reactUtils';
import AccountPageTemplate from '../components/account-settings/AccountTemplate';

const content = {
  title: 'verify_account_title',
  subtitle: 'verify_account_upload',
  text:
    '<p class="account-page__header-text">You have won and want to payout your winnings? That is not a problem at all!,In order to identify you within the Luckycasino website, and due to official security regulations, we require that you submit a legible copy of your official, photographic ID, as well as a copy of a second document stating your address.,These measures are in place solely for your safety, in order to ensure that no unauthorised third parties can use your access data and that no unauthorised transactions can take place. We ask for your understanding for these security measures.,How does it work? We only need three files. Sounds complicated, but is simple as it gets.</p>',
  button_text: 'verify_account_upload',
  documents: [
    {
      title: 'verify_account_photo',
      examples: '<li>Passport</li><li>Personal ID Card</li>',
    },
    {
      title: 'verify_account_address',
      examples: ` <li>Correspondence from official bodies (stating your first name, surname and address, one site document, no older than 3 months)</li>  <li>Legible bank statement stating your address (amounts covered, no older than three months)</li>  <li>Utilities bill (telephone/electricity/gas, no older than eight weeks, no older than three months)</li> `,
    },
    {
      title: 'verify_account_payment',
      examples: `
      <li>Legible bank or credit card statement stating your address (amounts covered)</li>
      <li>Copy of your credit or banker’s card (please cover your CVV and the first 12 digits of your credit card number)</li>
      <li>Screenshot of your Skrill or Neteller accounts (stating your name and account ID)</li>
      `,
    },
  ],
};

const VerifyAccountPage = () => {
  const { t } = useI18n();
  return (
    <AccountPageTemplate title={t(content.title)} text={content.text}>
      <div className="verify-account-page">
        <h6>{t(content.subtitle)}</h6>
        <ol className="verify-account-page__ol">
          {content.documents.map(document => {
            return (
              <li>
                {t(document.title)}
                <ul className="verify-account-page__ul">
                  {replaceStringTagsReact(String(document.examples))}
                </ul>
              </li>
            );
          })}
        </ol>
        <Button className="rounded-pill">{t(content.button_text)}</Button>
      </div>
    </AccountPageTemplate>
  );
};

export default VerifyAccountPage;
