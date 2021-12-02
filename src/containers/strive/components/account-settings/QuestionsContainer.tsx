import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { PagesName } from '../../../../constants';
import { useRoutePath } from '../../../../hooks';
import { useI18n } from '../../../../hooks/useI18n';
import Link from '../../../../components/Link';
import clsx from 'clsx';

interface Props {
  items: {
    title: string;
    body: string;
  }[];
  className?: string;
}

const QuestionItem = ({ item, index }) => {
  return (
    <div className="questions-acr__item">
      <Accordion.Toggle
        className="questions-acr__item-toggle pl-3 pr-5 py-3"
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
      <i
        className={clsx(
          `icon-${window.__config__.name}-down1`,
          'questions-acr__item-icon events-none',
        )}
      ></i>
    </div>
  );
};

const QuestionsContainer = ({ items, className }: Props) => {
  const { t } = useI18n();
  const faqRoute = useRoutePath(PagesName.FaqPage);
  return (
    <div className={className ? className : ''}>
      <h3 className="mb-3 questions-title">{t('user_questions')}</h3>
      <Accordion className="questions-acr">
        {items.map((item, index) => {
          return <QuestionItem key={index} item={item} index={index} />;
        })}
      </Accordion>
      <u className="d-block text-center my-3 text-14 font-weight-bold">
        <Link to={faqRoute}>{t('user_all_faq')}</Link>
      </u>
    </div>
  );
};

export default QuestionsContainer;
