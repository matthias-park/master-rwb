import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

interface LimitProps {
  id: string;
  title: string;
  subText: string;
  currentLimit: string;
  usedLimit: string;
  leftLimit: string;
  pendingLimit?: string;
  requestDate?: string;
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

const LimitsPage = () => {
  const { t, jsxT } = useI18n();
  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1>{t('limits_page_title')}</h1>
      <p className="mb-4">{t('limits_page_sub_text')}</p>
      <div className="play-responsible-block mb-3">
        <i className="icon-thumbs"></i>
        {jsxT('play_responsible_block_link')}
      </div>
      <LimitsCard
        id="1"
        title="Beperk je stortingen"
        subText="Zet niet te veel op het spel: bepaal zelf hoeveel je binnen de 7 dagen op je speelrekening kunt storten. Wil je je limiet hieronder verhogen of verlagen?"
        currentLimit="300"
        usedLimit="50"
        leftLimit="250"
        pendingLimit={'500'}
        requestDate={'11 augustus 2020 – 12.16 u'}
      />
      <LimitsCard
        id="1"
        title="Beperk je stortingen"
        subText="Zet niet te veel op het spel: bepaal zelf hoeveel je binnen de 7 dagen op je speelrekening kunt storten. Wil je je limiet hieronder verhogen of verlagen?"
        currentLimit="300"
        usedLimit="50"
        leftLimit="250"
      />
    </main>
  );
};

export default LimitsPage;
