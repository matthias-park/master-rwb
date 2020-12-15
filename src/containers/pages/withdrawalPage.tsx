import React, { useState } from 'react';
// import useSWR from 'swr';
// import { getApi } from '../../utils/apiUtils';
import { WITHDRAWAL_LIST } from '../../constants';
import WithdrawalListItem from '../../types/WithdrawalListItem';

const WithdrawAmount = () => (
  <div className="col-m-12 col-lg-3 first">
    <div className="for-validation">
      <div className="form-group" style={{ width: '100%' }}>
        <label htmlFor="inputFirstname">Withdrawable Balance</label>
        <div className="current_balance">
          <img
            style={{ maxWidth: '25px' }}
            src="/bnl/tonybet18/images/icons/bill_icon-ae1054e155e33f2da90267dee29aaa5d458fd555e9a3c6608ff5bc856b75378d.svg"
            alt="Bill icon"
          />
          <i className="fa fa-money" aria-hidden="true"></i>
          <span style={{ verticalAlign: 'middle' }}>936.44 €</span>
        </div>
      </div>

      <div className="form-group">
        <div className="form-group">
          <input
            type="text"
            name="amount"
            id="amount"
            className="form-control"
            data-validation="ac"
            placeholder="min 10.00 € max 936.44 €"
          />
        </div>
      </div>

      <div className="form-group">
        <button
          name="button"
          type="submit"
          className="btn full-width btn-lg btn-sm-wide pull-right btn-violet submit-btn"
          data-disable-with="Waiting..."
        >
          Withdrawal request
        </button>{' '}
      </div>
      <div className="clearfix"></div>
    </div>
  </div>
);

const AdditionalInfo = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <div
        className="card-header collapsed"
        onClick={() => setExpanded(!expanded)}
        id="headingOne"
        data-toggle="collapse"
        data-target="#collapseOne"
        aria-expanded="true"
        aria-controls="collapseOne"
      >
        <h5 className="mb-0">Additional information</h5>
        <div className="collapse-icon-wrp">
          <div className="collapse-icon"></div>
        </div>
      </div>
      <div
        id="collapseOne"
        className={`collapse ${expanded ? 'show' : ''}`}
        aria-labelledby="headingOne"
        data-parent="#accordion"
      >
        <div className="card-body">
          <p>Use the form above to request a withdrawal.&nbsp;</p>
          <p>
            Withdrawal requests can take up to 48 hours to process as all
            withdrawals are handled manually.
          </p>
          <p>
            For more information about making withdrawals, managing your
            payments and balancing your withdrawals, visit our{' '}
            <a href="https://tonybet.com/payments/payment_methods?lang=en">
              Payment Methods
            </a>{' '}
            page.
          </p>

          <p>
            <u>Withdrawal to bank account or Credit/Debit Card</u>
          </p>
          <p>
            All bank payout requests are usually handled through an ordinary
            bank transfer. It takes up to 4 working days to receive your funds.
          </p>
          <p>
            <strong>
              Please note that minimum bank withdrawal amount is: 5.00 €
            </strong>
          </p>
          <p>
            If it is not your first withdrawal during last 14 days, a fee of
            1.50 € shall be charged.
          </p>

          <p>
            <u>Withdrawal to e-wallets</u>
          </p>
          <p>
            Please note that you can request following withdrawal if you have
            made deposit from appropriate e-wallet account before.
          </p>
          <p>
            One withdrawal per 28 days period is free of charge. Additional
            withdrawals within this period will be charged with a fee of 1.50 €.
          </p>
          <p>
            Please note that a charge of 4.0% will apply to all e-wallet
            withdrawals if the deposit amount has not been used. Should you make
            at least one bet, this fee will not be charged.
          </p>

          <p>
            <strong>Minimum withdrawal amount: 5.00 €</strong>
          </p>

          <p>
            <strong>Maximum one-time withdrawal amount: 3,000.00 €</strong>
          </p>

          <p>
            <strong>Your maximum one-time withdrawal amount: 936.44 €</strong>
          </p>

          <p>
            <strong>Maximum weekly withdrawal amount: 15,000.00 €</strong>
          </p>

          <p>
            {' '}
            (The maximum weekly withdrawal amount includes all player’s
            withdrawals made in one-week period. One week is considered to be 7
            (seven) subsequent calendar days, the first of which is the day of
            the one-time payout withdrawal request).{' '}
          </p>

          <p>
            <strong>Maximum monthly withdrawal amount: 50,000.00 €</strong>
          </p>
          <p>
            {' '}
            (The maximum monthly withdrawal amount includes all player’s
            withdrawals made in one-month period. One month is considered to be
            30 (thirty) subsequent calendar days, the first of which is the day
            of the one-time payout withdrawal request).{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

const WithdrawalRequests = () => {
  return (
    <div className="panel panel-white no-padding-sm">
      <hr
        style={{
          marginBottom: 0,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          borderTop: 'none',
        }}
      />
      <div className="panel-heading show">
        <div className="row">
          <div className="title pt-2 withdraw_requests">
            Money withdrawal requests
          </div>
        </div>
      </div>

      <div className="panel-table table-responsive table-mobile withdrawal-cancel mb-5">
        <table className="table table-hover selectableRadioRows table-2">
          <thead>
            <tr style={{ borderBottom: '3px solid rgba(255,255,255,0.2)' }}>
              <th scope="col">
                <span className="d-none d-lg-block">
                  <b>Date / Time</b>
                </span>
              </th>
              <th scope="col">
                <span className="d-none d-lg-block">
                  <b>Withdrawal Method</b>
                </span>
              </th>
              <th scope="col">
                <span className="d-none d-lg-block">
                  <b>Account</b>
                </span>
              </th>
              <th scope="col" className="text-right">
                <span className="d-none d-lg-block">
                  <b>Amount</b>
                </span>
              </th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="withdrawal_row">
              <form
                className="panel panel-white no-padding-sm"
                action="/withdraw/cancel"
                accept-charset="UTF-8"
                method="post"
              ></form>
              <td>
                <b>2020-10-07 09:10:52</b>
              </td>
              <td>
                <b>Swedbank</b>
              </td>
              <td>
                <b>dfgsdfgsd</b>
              </td>

              <td className="text-right">
                <b>10.00 €</b>
              </td>
              <td className="text-center text-md-right">
                <button
                  name="button"
                  type="submit"
                  className="btn cancel-withdraw float-md-right"
                  data-disable-with="Waiting..."
                >
                  Cancel withdrawal
                </button>{' '}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CardItem = ({ card }) => (
  <div className="mb-2 col-lg-3 col-sm-6 col-12 account-block">
    <input
      type="radio"
      name="id"
      id="aid_0"
      value="5info@gmail.com"
      className=""
    />
    <label
      className="withdrawal-bank selected"
      data-min-withdraw="10.00 €"
      data-max-withdraw="936.44 €"
      htmlFor="aid_0"
    >
      <div className="d-flex flex-column justify-content-sm-between">
        <div>
          <div className="radio card-wrapper">
            <span className="card-inner">
              <span>{card.cardName}</span>
            </span>
            <span
              className="card-inner"
              style={{ textAlign: 'right', height: '48px' }}
            >
              <img src={card.img} alt="img" className="bank" />
            </span>
          </div>
        </div>
        <div className="account-number">
          <span className="account" data-account={card.account}>
            {card.account}
          </span>
        </div>
        <div>
          <div className="element-title">Name:</div>
          <span className="name">{card.name}</span>
        </div>
      </div>
    </label>
  </div>
);

const WithdrawalPage = () => {
  // const { data } = useSWR('/api/withdrawal-list', getApi);
  const data: WithdrawalListItem[] = WITHDRAWAL_LIST;
  return (
    <>
      <div className="row">
        <div className="title pt-2 withdrawal-title">Withdrawal</div>
      </div>

      <form
        autoComplete="off"
        className="panel panel-white no-padding-sm"
        id="withdrawal-method-form"
        action="/withdraw"
        accept-charset="UTF-8"
        method="post"
      >
        <input name="utf8" type="hidden" value="✓" />
        <div className="row flex-wrapper">
          <WithdrawAmount />

          <div className="col-m-12 col-lg-9 last">
            <div className="row">
              {data &&
                data.map(card => <CardItem key={card.account} card={card} />)}
            </div>
          </div>
        </div>
      </form>
      <WithdrawalRequests />
      <AdditionalInfo />
    </>
  );
};

export default WithdrawalPage;
