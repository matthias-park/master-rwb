import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';

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
        className="questions-acr__item-toggle"
        eventKey={`${index}`}
      >
        {item.title}
      </Accordion.Toggle>
      <Accordion.Collapse
        className="questions-acr__item-body"
        eventKey={`${index}`}
      >
        <p>{item.body}</p>
      </Accordion.Collapse>
      <i className="questions-acr__item-icon icon-down1"></i>
    </div>
  );
};

const QuestionsContainer = ({ items }: Props) => {
  return (
    <>
      <h3 className="mb-3">Questions?</h3>
      <Accordion className="questions-acr">
        {items.map((item, index) => {
          return <QuestionItem item={item} index={index} />;
        })}
      </Accordion>
      <u className="d-block text-center my-3 text-14 font-weight-bold">
        <Link to="/">All frequently asked questions</Link>
      </u>
    </>
  );
};

export default QuestionsContainer;
