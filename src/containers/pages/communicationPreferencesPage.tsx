import React, { useState, useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import CustomToggleCheck from '../../components/CustomToggleCheck';
import Spinner from 'react-bootstrap/Spinner';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../hooks/useApi';
import SettingsForm from '../../components/account-settings/SettingsForm';
import QuestionsContainer from '../../components/account-settings/QuestionsContainer';
import HelpBlock from '../../components/HelpBlock';
import CustomAlert from '../../components/CustomAlert';

interface CommunicationPrefProps {
  id: string;
  title: string;
  subText: string;
  prefs: {
    title: string;
    checked: boolean;
  }[];
}

const CommunicationPrefCard = ({
  id,
  title,
  subText,
  prefs,
}: CommunicationPrefProps) => {
  const [prefChecked, setPrefChecked] = useState(false);
  return (
    <li className="communication-prefs__pref">
      <h6 className="communication-prefs__pref-title">{title}</h6>
      <p className="communication-prefs__pref-text">{subText}</p>
      {prefs.map(pref => (
        <div className="communication-prefs__pref-item">
          <span>{pref.title}</span>
          <span className="ml-auto d-flex align-items-center">
            <CustomToggleCheck
              id={1}
              checked={pref.checked}
              onChange={() => setPrefChecked(!prefChecked)}
            />
          </span>
        </div>
      ))}
    </li>
  );
};

const CommunicationPreferencesPage = () => {
  const { t, jsxT } = useI18n();
  const { addToast } = useToasts();
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/communication_preferences',
    {
      onErrorRetry: (error, key) => {
        addToast(`Failed to fetch user settings`, {
          appearance: 'error',
          autoDismiss: true,
        });
        console.log(error);
      },
    },
  );
  const questionItems = useMemo(
    () => [
      { title: t('deposit_question_1'), body: 'deposit_answer_1' },
      { title: t('deposit_question_2'), body: 'deposit_answer_2' },
    ],
    [t],
  );

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{t('communication_preferences_page_title')}</h1>
      <p className="mb-4">{t('communication_preferences_page_sub_text')}</p>
      <ul className="list-unstyled communication-prefs">
        <CommunicationPrefCard
          id={'1'}
          title="News & actions"
          subText="Lorem ipsum dolor sit amet lorem dolor sit ipsum Lorem ipsum dolor sit amet lorem dolor sit ipsum Lorem ipsum"
          prefs={[
            { title: 'News from National Lottery', checked: true },
            { title: 'News from National Lottery', checked: true },
          ]}
        />
        <CommunicationPrefCard
          id={'1'}
          title="News & actions"
          subText="Lorem ipsum dolor sit amet lorem dolor sit ipsum Lorem ipsum dolor sit amet lorem dolor sit ipsum Lorem ipsum"
          prefs={[
            { title: 'News from National Lottery', checked: true },
            { title: 'News from National Lottery', checked: true },
          ]}
        />
      </ul>
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['phone']}
        className={'d-block d-xl-none'}
      />
    </main>
  );
};

export default CommunicationPreferencesPage;
