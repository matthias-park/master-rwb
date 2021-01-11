import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import QuestionsContainer from 'components/account-settings/QuestionsContainer';

const questionItems = [
  {
    title: 'Additional Information',
    body: 'Expanded description block',
  },
  {
    title: 'Additional Information',
    body: 'Expanded description block',
  },
];

const TransactionsPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [periodSelected, setPeriodSelected] = useState(0);

  return (
    <div className="container-fluid px-0 px-sm-4 mb-4">
      <h2 className="mb-4">Transactions</h2>
      <div className="date-filter mb-4">
        <div className="date-filter__picker-wrp">
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
          />
          <i className="date-filter__picker-wrp-icon icon-calendar-m"></i>
        </div>
        <span className="text-gray-400 mx-auto mx-sm-1">-</span>
        <div className="date-filter__picker-wrp">
          <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
          <i className="date-filter__picker-wrp-icon icon-calendar-m"></i>
        </div>
        <Button className="mt-3 mt-sm-0 ml-sm-2" variant="primary">
          Search
        </Button>
        <div className="account-tabs account-tabs--mx-205">
          <button
            className={`account-tabs__tab ${periodSelected === 7 && 'active'}`}
            onClick={() => setPeriodSelected(7)}
          >
            7 days
          </button>
          <button
            className={`account-tabs__tab ${periodSelected === 14 && 'active'}`}
            onClick={() => setPeriodSelected(14)}
          >
            14 days
          </button>
          <button
            className={`account-tabs__tab ${periodSelected === 30 && 'active'}`}
            onClick={() => setPeriodSelected(30)}
          >
            30 days
          </button>
        </div>
      </div>
      <div className="table-container mb-4">
        <Table hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Account</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong className="heading-sm">Date</strong>2020-10-26
              </td>
              <td>
                <strong className="heading-sm">Action</strong>Sports bet lost
              </td>
              <td>
                <strong className="heading-sm">Account</strong>-
              </td>
              <td>
                <strong className="heading-sm">Amount</strong>-5€
              </td>
            </tr>
            <tr>
              <td>
                <strong className="heading-sm">Date</strong>2020-10-26
              </td>
              <td>
                <strong className="heading-sm">Action</strong>Sports bet lost
              </td>
              <td>
                <strong className="heading-sm">Account</strong>-
              </td>
              <td>
                <strong className="heading-sm">Amount</strong>-5€
              </td>
            </tr>
            <tr>
              <td>
                <strong className="heading-sm">Date</strong>2020-10-26
              </td>
              <td>
                <strong className="heading-sm">Action</strong>Sports bet lost
              </td>
              <td>
                <strong className="heading-sm">Account</strong>-
              </td>
              <td>
                <strong className="heading-sm">Amount</strong>-5€
              </td>
            </tr>
            <tr>
              <td>
                <strong className="heading-sm">Date</strong>2020-10-26
              </td>
              <td>
                <strong className="heading-sm">Action</strong>Sports bet lost
              </td>
              <td>
                <strong className="heading-sm">Account</strong>-
              </td>
              <td>
                <strong className="heading-sm">Amount</strong>-5€
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="table-container__info">
          The betting history displayed on this page only covers the period of
          the last six months.
        </div>
      </div>
      <QuestionsContainer items={questionItems} />
    </div>
  );
};

export default TransactionsPage;
