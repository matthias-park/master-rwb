import React from 'react';
import Main from '../pageLayout/Main';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/esm/Button';

const data = {
  intro: {
    title: 'Payment Providers',
    text:
      "At LuckyCircus, service and security are our top priorities. That's why we try to work very carefully when it comes to your deposits and withdrawals. To make the process as easy and, above all, fast as possible, we offer you the most common options, always without any fees- that is our promise.",
  },
  tables: [
    {
      title: 'Deposits at Lucky Circus',
      text: 'Funds set aside for gaming can be deposited in different ways.',
      btn: {
        value: 'Deposit',
        variant: 'primary',
      },
      columns: ['Method', 'Fees', 'Processing', 'Currency', 'Min', 'Max', ''],
      rows: [
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
      ],
    },
    {
      title: 'How to withdraw your money from Lucky Circus?',
      text:
        'Have you won at Luckycasino? Yeah, congratulations! You may withdraw your funds via one of our secure payment systems below.',
      btn: {
        value: 'Withdrawl',
        variant: 'tertiary',
      },
      columns: ['Method', 'Fees', 'Processing', 'Currency', 'Min', 'Max', ''],
      rows: [
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
        ['Trustly', 'Free', 'Immedietly', 'Euro', '10.00', '5,000.00'],
      ],
    },
  ],
};

const InfoPaymentPage = () => {
  return (
    <Main
      title="Information"
      icon="icon-circle-info"
      className="info-payment-page"
    >
      <div className="info-payment-page__content container">
        <h4 className="info-payment-page__title">{data.intro.title}</h4>
        <p className="info-payment-page__text">{data.intro.text}</p>
        {data.tables.map(table => {
          return (
            <div className="info-payment-page__section">
              <h6 className="info-payment-page__section-title">
                {table.title}
              </h6>
              <p>{table.text}</p>
              <Table>
                <thead>
                  <tr>
                    {table.columns.map(column => (
                      <th>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map(row => {
                    return (
                      <tr>
                        {row.map(item => (
                          <td>{item}</td>
                        ))}
                        <td>
                          <Button
                            className="rounded-pill"
                            variant={table.btn.variant}
                          >
                            {table.btn.value}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          );
        })}
      </div>
    </Main>
  );
};

export default InfoPaymentPage;
