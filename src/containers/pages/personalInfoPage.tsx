import React, { useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../hooks/useApi';
import SettingsForm from '../../components/account-settings/SettingsForm';
import { SettingsField } from '../../types/api/user/ProfileSettings';
import QuestionsContainer from '../../components/account-settings/QuestionsContainer';
import HelpBlock from '../../components/HelpBlock';

interface PersonalInfoProps {
  id: string;
  title: string;
  subText: string;
  data: JSX.Element;
}

const PersonalInfoCard = ({ id, title, subText, data }: PersonalInfoProps) => {
  return (
    <Accordion className="info-container mb-3">
      <div className="info-container__info pt-3">
        <p className="mb-2">
          <b>{title}</b>
        </p>
        <p className="text-14 text-gray-700 pt-1">{subText}</p>
        <Accordion.Toggle
          as="button"
          eventKey={id}
          className="info-container__edit btn btn-light btn-sm px-3"
        >
          Annuleer
        </Accordion.Toggle>
      </div>
      <div className="info-container__text">
        {data}
        <Accordion.Collapse eventKey={id}>
          <>
            <p className="text-gray-800 pt-3">
              <b>Nieuwe limiet voor je wekelijkse stortingen</b>
            </p>
            <Form.Group>
              <Form.Control type="text" placeholder=" "></Form.Control>
              <label className="text-14">something</label>
            </Form.Group>
            <Button variant="primary" className="mt-2">
              send request
            </Button>
          </>
        </Accordion.Collapse>
      </div>
    </Accordion>
  );
};

const PersonalInfoPage = () => {
  const { t, jsxT } = useI18n();
  const { addToast } = useToasts();
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/personal_info',
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
  const isDataLoading = !data && !error;

  const questionItems = useMemo(
    () => [
      { title: t('deposit_question_1'), body: 'deposit_answer_1' },
      { title: t('deposit_question_2'), body: 'deposit_answer_2' },
    ],
    [t],
  );

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{t('personal_info_page_title')}</h1>
      <p className="mb-4">{t('personal_info_page_sub_text')}</p>
      <div className="play-responsible-block mb-3">
        <i className="icon-thumbs"></i>
        {jsxT('play_responsible_block_link')}
      </div>
      <PersonalInfoCard
        id="1"
        title="Je identiteit"
        subText="Kies hier gerust een andere naam dan die op je identiteitskaart. Hoe mogen we je begroeten? "
        data={
          <ul className="list-unstyled mb-0">
            <li className="mb-1">
              <b>Dustin Stone</b>
            </li>
            <li className="text-gray-400 mb-1">Geslacht: Mannelijk</li>
            <li className="text-gray-400 mb-1">Taal: Nederlands</li>
            <li className="text-gray-400">Geboortedatum: 21/05/1982</li>
          </ul>
        }
      />
      <PersonalInfoCard
        id="2"
        title="Begroeting"
        subText="Kies hier gerust een andere naam dan die op je identiteitskaart. Hoe mogen we je begroeten? "
        data={
          <p className="mb-0">
            <b>Hé Dusty!</b>
          </p>
        }
      />
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['phone']}
        className={'d-block d-xl-none'}
      />
    </main>
  );
};

export default PersonalInfoPage;
