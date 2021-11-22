import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import clsx from 'clsx';

interface StepsAccordionProps {
  steps: {
    title: string;
    content: JSX.Element;
  }[];
  activeStep: number;
}

const StepsAccordion = ({ steps, activeStep }: StepsAccordionProps) => {
  return (
    <Accordion
      activeKey={(activeStep - 1).toString()}
      as="ul"
      bsPrefix="accordion-steps"
    >
      {steps.map((step, i) => (
        <>
          <Accordion.Toggle
            eventKey={i.toString()}
            as="li"
            className={clsx(
              'accordion-steps__toggle',
              activeStep - 1 === i && 'active',
            )}
          >
            <span className="accordion-steps__toggle-index">{i + 1}</span>
            {step.title}
          </Accordion.Toggle>
          <Accordion.Collapse
            eventKey={i.toString()}
            className="accordion-steps__menu"
          >
            {step.content}
          </Accordion.Collapse>
        </>
      ))}
    </Accordion>
  );
};

export default StepsAccordion;
