import React from 'react';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import { useI18n } from '../../hooks/useI18n';

interface Props {
  items: {
    title: string;
    body: string;
  }[];
}

const QuestionItem = ({ item, index }) => {
  return (
    <div className="questions-acr__item">
      <Accordion.Toggle
        className="questions-acr__item-toggle px-3"
        eventKey={`${index}`}
      >
        {item.title}
      </Accordion.Toggle>
      <Accordion.Collapse
        className="questions-acr__item-body"
        eventKey={`${index}`}
      >
        <p className="px-3 py-2 mb-0">{item.body}</p>
      </Accordion.Collapse>
      <i className="questions-acr__item-icon icon-down1 events-none"></i>
    </div>
  );
};

const QuestionsContainer = ({ items }: Props) => {
  const { t } = useI18n();
  return (
    <>
      <h3 className="mb-3">{t('user_questions')}</h3>
      <Accordion className="questions-acr">
        {items.map((item, index) => {
          return <QuestionItem key={index} item={item} index={index} />;
        })}
      </Accordion>
      <u className="d-block text-center my-3 text-14 font-weight-bold">
        <Link to="/">{t('user_all_faq')}</Link>
      </u>
    </>
  );
};

export default QuestionsContainer;
