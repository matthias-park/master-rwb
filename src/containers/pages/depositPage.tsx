import React, { useState } from 'react';
// import useSWR from 'swr';
// import { getApi } from '../../utils/apiUtils';
import { DEPOSIT_LIST } from '../../constants';
import DepositListItem from '../../types/DepositListItem';

const BankItem = ({ item }) => (
  <div className="payment_method d-inline-block ">
    <div className="radio bank-select">
      <div className="payment_info">{item.info}</div>
      <label
        htmlFor="method_mokejimaiou"
        data-pay-info="                                                    
                                                  "
        title="Transfer details: Transfer time 1-2 min. Minimum 10.00 € "
      >
        <span style={{ backgroundImage: `url(${item.img})` }}></span>
        <img className="rounded" alt="" src={item.img} />
      </label>
    </div>
  </div>
);

const DepositAmount = () => (
  <div className="col-m-12 col-lg-3 first">
    <div className="step1 panel-body">
      <div className="form-group">
        <div className="deposit_form_sum form-group">
          <label className="control-label" htmlFor="sum">
            Amount
            <small id="deposit_sum_error" className="text-danger"></small>
          </label>
          <div className="input-group">
            <input
              id="sum"
              type="text"
              value=""
              name="amount"
              className="form-control"
              placeholder="0.0"
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <div className="deposit_form_bonus form-group">
          <label className="control-label" htmlFor="bonus_code">
            Bonus code
            <small id="deposit_bonus_error" className="text-danger"></small>
          </label>
          <input
            id="bonus_code"
            type="text"
            name="bonus_code"
            className="form-control"
            value=""
          />
        </div>
      </div>
      <div className="spinner col-xs-offset-5 hidden">
        <img
          src="/bnl/tonybet18/images/TB-spinner-loader-blue-5af8310fa76176c045a1d68af2b21a91d02aa8cb8cafa881b3d71817181294e4.gif"
          alt="Tb spinner loader blue"
        />
      </div>
      <div className="form-group deposit-form-place">
        <div className="deposit-form"></div>
      </div>
    </div>
  </div>
);

const AdditionalInfo = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <div
        className="card-header collapsed"
        id="headingDepositInfo"
        data-toggle="collapse"
        data-target="#collapseDepositInfo"
        aria-expanded="true"
        aria-controls="collapseDepositInfo"
        onClick={() => setExpanded(!expanded)}
      >
        Additional information
      </div>
      <div
        id="collapseDepositInfo"
        className={`collapse ${expanded ? 'show' : ''}`}
        aria-labelledby="headingDepositInfo"
      >
        <div className="card-body">
          <p>
            Your very first transaction has to be confirmed by our payment
            department. Please note that it can take up to 24 hours.
          </p>
          <p>
            The transaction may appear on your bank statement as "tonybet.com
            +3712820717"{' '}
          </p>
          <p>
            Tonybet operates a policy that ensures you must withdraw funds back
            to the source from which the last deposit was made. This policy is
            regulation and it protects Tonybet from potential money laundering
            or any other form of foul play. In order to change your money
            transferring options, please contact TonyBet through the ‘Contact
            Us’ tab and choose the category ‘Deposits/Withdrawals’. If you have
            any problems please contact us at info@tonybet.com.
          </p>
          <p>
            By following legal regulation requirements TonyBet reserves the
            right to request copies of the payment authorization from customers.
          </p>
        </div>
      </div>
    </div>
  );
};

const DepositPage = () => {
  // const { data } = useSWR('/api/deposit-list', getApi);
  const data: DepositListItem[] = DEPOSIT_LIST;
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="title pt-2">Deposit</div>
        </div>
        <form>
          <div className="row flex-wrapper">
            <DepositAmount />
            <div className="col-m-12 col-lg-9 second px-sm-4 px-1">
              <div className="payment_methods">
                <div className="step1 panel-body">
                  <div className="bank-list">
                    {data &&
                      data.map(bank => <BankItem key={bank.img} item={bank} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="panel-footer third">
          <div id="deposit_form_bank_error"></div>
          <div className="pull-left">
            <div className="form-group">
              <div className="current_balance">
                <b id="transfer_details" className="step1"></b>
                <div id="pay-info"></div>
              </div>
            </div>
          </div>
          <br />
          <button
            className="hide btn btn-success btn-lg btn-md-wide pull-right btn-icon"
            type="submit"
          >
            Deposit
            <i className="icon-arrow-right"></i>
          </button>
          <div className="clearfix"></div>
        </div>
      </div>
      <p style={{ color: '#ef6723' }}>
        Please take note that the name registered to the bank / credit card /
        e-wallet account must match the name registered on your personal TonyBet
        account.{' '}
      </p>
      <AdditionalInfo />
    </>
  );
};

export default DepositPage;
