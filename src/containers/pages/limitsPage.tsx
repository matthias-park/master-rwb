import React, { useState, useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../hooks/useApi';
import SettingsForm from '../../components/account-settings/SettingsForm';
import { SettingsField } from '../../types/api/user/ProfileSettings';
import QuestionsContainer from '../../components/account-settings/QuestionsContainer';
import HelpBlock from '../../components/HelpBlock';

interface LimitProps {
  id: string;
  title: string;
  subText: string;
  currentLimit: string;
  usedLimit: string;
  leftLimit: string;
  pendingLimit?: string;
  requestDate?: string;
  fields: SettingsField[];
  action: string;
}

const LimitsCard = ({
  id,
  title,
  subText,
  currentLimit,
  usedLimit,
  leftLimit,
  pendingLimit,
  requestDate,
  fields,
  action,
}: LimitProps) => {
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
        <ul className="list-unstyled mb-0 play-limits">
          <li className="play-limits__limit">
            <p className="play-limits__limit-title">currentLimit</p>
            <p className="play-limits__limit-total text-primary">
              € {currentLimit}
            </p>
          </li>
          <li className="play-limits__limit">
            <p className="play-limits__limit-title">usedLimit</p>
            <p className="play-limits__limit-total">€ {usedLimit}</p>
          </li>
          <li className="play-limits__limit">
            <p className="play-limits__limit-title">leftLimit</p>
            <p className="play-limits__limit-total">€ {leftLimit}</p>
          </li>
        </ul>
        {pendingLimit && requestDate && (
          <>
            <hr className="mt-2 mb-3"></hr>
            <p className="text-14 text-gray-800 mb-2">
              <b>Je limietwijziging wordt verwerkt</b>
            </p>
            <p className="text-14 text-gray-400 mb-2">
              Je gevraagde limiet:{' '}
              <b className="text-gray-800">€ {pendingLimit}</b>
            </p>
            <p className="text-14 text-gray-400">
              Gaat in op: <b className="text-gray-800">{requestDate}</b>
            </p>
          </>
        )}
        <Accordion.Collapse eventKey={id}>
          <SettingsForm id={id} fields={fields} action={action} />
        </Accordion.Collapse>
      </div>
    </Accordion>
  );
};

const LimitsPage = () => {
  const { t, jsxT } = useI18n();
  const { addToast } = useToasts();
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/play_limits',
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
      <h1>{t('limits_page_title')}</h1>
      <p className="mb-4">{t('limits_page_sub_text')}</p>
      <div className="play-responsible-block mb-3">
        <i className="icon-thumbs"></i>
        {jsxT('play_responsible_block_link')}
      </div>
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {!!error && (
        <h2 className="mt-3 mb-5 text-center">
          {t('settings_page_failed_to_load')}
        </h2>
      )}
      {!!data && (
        <>
          {Object.keys(data).map(limit => (
            <LimitsCard
              key={data[limit].id}
              id={data[limit].id}
              title={data[limit].title}
              subText={data[limit].note}
              currentLimit="300"
              usedLimit="50"
              leftLimit="250"
              pendingLimit={'500'}
              requestDate={'11 augustus 2020 – 12.16 u'}
              fields={data[limit].fields}
              action={data[limit].action}
            />
          ))}
        </>
      )}
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['phone']}
        className={'d-block d-xl-none'}
      />
    </main>
  );
};

export default LimitsPage;
