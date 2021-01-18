import React, { useState } from 'react';
import { ACCOUNT_SETTINGS, ComponentName } from '../../constants';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import useSWR from 'swr';
import ProfileSettings from '../../types/api/user/ProfileSettings';

interface SettingProps {
  active?: boolean;
  order: string;
}

const RequiredDocuments = ({ active, order }: SettingProps) => {
  const [idUpload, setIdUpload] = useState('');
  const [residenceUpload, setResidenceUpload] = useState('');
  const [depositUpload, setDepositUpload] = useState('');

  return (
    <Card className="settings-card">
      <Card.Header
        className={`settings-card__header ${active ? 'active' : ''}`}
      >
        <Accordion.Toggle as="a" eventKey={order} className="text-dark">
          Required documents
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={order}>
        <Card.Body className="pt-2">
          <div className="row mx-0 flex-column flex-sm-row">
            <div className="col-12 col-sm-4 px-0 pl-sm-0 pr-sm-1 mb-1 mx-0">
              <div className="p-3 bg-gray-custom-200 rounded d-flex flex-column h-100">
                <p className="font-14">
                  <strong>Upload a copy of a valid ID</strong>
                </p>
                <p className="mb-3">
                  NOTE: Only One document can be uploaded one time before next
                  approval lorem ipsu longer text here
                </p>
                <Form.File custom className="mt-auto">
                  <Form.File.Label
                    className={idUpload.length ? 'uploaded' : ''}
                    onChange={e => setIdUpload(e.target.files[0].name)}
                  >
                    {idUpload.length ? idUpload : 'Upload'}
                    <Form.File.Input />
                  </Form.File.Label>
                </Form.File>
              </div>
            </div>
            <div className="col-12 col-sm-4 px-0 pl-sm-0 pr-sm-1 mb-1 mx-0">
              <div className="p-3 bg-gray-custom-200 rounded d-flex flex-column h-100">
                <p className="font-14">
                  <strong>Upload a copy of a valid ID</strong>
                </p>
                <p className="mb-3">
                  NOTE: Only One document can be uploaded one time before next
                  approval lorem ipsu longer text here
                </p>
                <Form.File custom className="mt-auto">
                  <Form.File.Label
                    className={residenceUpload.length ? 'uploaded' : ''}
                    onChange={e => setResidenceUpload(e.target.files[0].name)}
                  >
                    {residenceUpload.length ? residenceUpload : 'Upload'}
                    <Form.File.Input />
                  </Form.File.Label>
                </Form.File>
              </div>
            </div>
            <div className="col-12 col-sm-4 px-0 pl-sm-0 pr-sm-1 pr-0 mb-1 mx-0">
              <div className="p-3 bg-gray-custom-200 rounded d-flex flex-column h-100">
                <p className="font-14">
                  <strong>Upload a copy of deposit receipt</strong>
                </p>
                <p className="mb-3">
                  NOTE: Only One document can be uploaded one time before next
                  approval lorem ipsu longer text here
                </p>
                <Form.File custom className="mt-auto">
                  <Form.File.Label
                    className={depositUpload.length ? 'uploaded' : ''}
                    onChange={e => setDepositUpload(e.target.files[0].name)}
                  >
                    {depositUpload.length ? depositUpload : 'Upload'}
                    <Form.File.Input />
                  </Form.File.Label>
                </Form.File>
              </div>
            </div>
          </div>
          <Button className="mt-3" variant="primary">
            SAVE
          </Button>
        </Card.Body>
      </Accordion.Collapse>
      <i className="settings-card__icon icon-down1"></i>
    </Card>
  );
};

const MarketingSettings = ({ active, order }: SettingProps) => {
  const [activeTab, setActiveTab] = useState('marketing');

  return (
    <Card className="settings-card">
      <Card.Header
        className={`settings-card__header ${active ? 'active' : ''}`}
      >
        <Accordion.Toggle as="a" eventKey={order} className="text-dark">
          Marketing Settings
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={order}>
        <Card.Body className="pt-2">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="account-tabs w-100">
                <button
                  className={`account-tabs__tab w-50 ${
                    activeTab === 'marketing' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('marketing')}
                >
                  Marketting Consents
                </button>
                <button
                  className={`account-tabs__tab w-50 ${
                    activeTab === 'cookies' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('cookies')}
                >
                  Cookies
                </button>
              </div>
            </div>
          </div>
          <div className={`${activeTab === 'marketing' ? '' : 'd-none'}`}>
            <p className="mt-3">
              I love cheese, especially cheese and wine say cheese. Fromage
              stilton who moved my cheese cheese strings cheesecake cheddar
              croque monsieur say cheese. Roquefort blue castello stinking
              bishop cheese and wine cheese on toast camembert de normandie
              fondue parmesan. Cheddar who moved my cheese danish fontina when
              the cheese comes out everybody's happy parmesan cheese slices
              rubber cheese hard cheese.
            </p>
            <div className="row mt-4">
              <ul className="col-12 col-sm-8 col-md-6 flex-column list-unstyled">
                <li className="d-flex align-items-center mb-2">
                  <span>Email</span>
                  <div className="settings-radios ml-auto">
                    <input
                      className="settings-radios__input"
                      type="radio"
                      id="email-yes"
                      name="email"
                      value="true"
                      hidden
                    ></input>
                    <label
                      className="settings-radios__label"
                      htmlFor="email-yes"
                    >
                      YES
                    </label>
                    <input
                      className="settings-radios__input"
                      type="radio"
                      id="email-no"
                      name="email"
                      value="false"
                      hidden
                    ></input>
                    <label
                      className="settings-radios__label"
                      htmlFor="email-no"
                    >
                      NO
                    </label>
                  </div>
                </li>
                <li className="d-flex align-items-center mb-2">
                  <span>SMS</span>
                  <div className="settings-radios ml-auto">
                    <input
                      className="settings-radios__input"
                      type="radio"
                      id="sms-yes"
                      name="sms"
                      value="true"
                      hidden
                    ></input>
                    <label className="settings-radios__label" htmlFor="sms-yes">
                      YES
                    </label>
                    <input
                      className="settings-radios__input"
                      type="radio"
                      id="sms-no"
                      name="sms"
                      value="false"
                      hidden
                    ></input>
                    <label className="settings-radios__label" htmlFor="sms-no">
                      NO
                    </label>
                  </div>
                </li>
                <li className="d-flex align-items-center mb-2">
                  <span>Livecalls</span>
                  <div className="settings-radios ml-auto">
                    <input
                      className="settings-radios__input"
                      type="radio"
                      id="calls-yes"
                      name="calls"
                      value="true"
                      hidden
                    ></input>
                    <label
                      className="settings-radios__label"
                      htmlFor="calls-yes"
                    >
                      YES
                    </label>
                    <input
                      className="settings-radios__input"
                      type="radio"
                      id="calls-no"
                      name="calls"
                      value="false"
                      hidden
                    ></input>
                    <label
                      className="settings-radios__label"
                      htmlFor="calls-no"
                    >
                      NO
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className={`${activeTab === 'cookies' ? '' : 'd-none'}`}>
            <h3 className="mt-3">Website Cookies</h3>
            <p>
              This kind of cookies is necessary for the website to function.
              They proceed the information related to privacy settings,
              information of logins and other adjustments made by a user. If
              these cookies will be deactivated or blocked, some parts of the
              website will not work properly.
            </p>
            <Form.Check custom id="websiteCookies" label="website cookies" />
            <h3 className="mt-3">Marketing Cookies</h3>
            <p>
              This kind of cookies is used to help the website work properly,
              improve your user experience, and to ensure that services promoted
              are relevant to you. Without these cookies, online advertisements
              you see will be less relevant to you.
            </p>
            <Form.Check
              custom
              id="MarketingCookies"
              label="marketing cookies"
            />
            <Button className="mt-3" variant="primary">
              SAVE
            </Button>
          </div>
        </Card.Body>
      </Accordion.Collapse>
      <i className="settings-card__icon icon-down1"></i>
    </Card>
  );
};

const BettingLossLimits = ({ active, order }: SettingProps) => {
  return (
    <Card className="settings-card">
      <Card.Header
        className={`settings-card__header ${active ? 'active' : ''}`}
      >
        <Accordion.Toggle as="a" eventKey={order} className="text-dark">
          Betting Loss Limits
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={order}>
        <Card.Body className="pt-2">
          <p>
            You can set the amount of money you can afford to lose by setting a
            loss limit. This limit comes into effect as soon as it's set and is
            valid for a pre-determined amount of time (1 day, 1 week, 1 month, 3
            months). NOTE: You can change your loss limits by choosing a
            different amount and time period. - If you decrease your limit, it
            will come into effect immediately. - If you increase your limit, it
            will come into effect after 7 days since the moment of setting the
            limit. Should you try and set your betting limit during this 7 day
            period again, the betting limit will come into effect 7 days after
            the last time it has been set.
          </p>
          <div className="row mt-3">
            <div className="col-12 col-sm-6">
              <Form.Group>
                <Form.Control
                  as="select"
                  size="sm"
                  type="text"
                  id="amount"
                  placeholder="Choose period"
                >
                  <option>1 day</option>
                  <option>1 week</option>
                  <option>1 month</option>
                </Form.Control>
                <small className="form-group__error-msg">Error message</small>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  size="sm"
                  type="text"
                  id="amount"
                  placeholder=" "
                />
                <label htmlFor="amount">Amount</label>
                <div className="form-group__icons">
                  <i className="icon-check"></i>
                  <i className="icon-exclamation"></i>
                </div>
                <small className="form-group__error-msg">Error message</small>
              </Form.Group>
            </div>
          </div>
          <Button className="mt-2" variant="primary">
            SET
          </Button>
        </Card.Body>
      </Accordion.Collapse>
      <i className="settings-card__icon icon-down1"></i>
    </Card>
  );
};

const DepositLimit = ({ active, order }: SettingProps) => {
  return (
    <Card className="settings-card">
      <Card.Header
        className={`settings-card__header ${active ? 'active' : ''}`}
      >
        <Accordion.Toggle as="a" eventKey={order} className="text-dark">
          Deposit Limit
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={order}>
        <Card.Body className="pt-2">
          <p>
            By setting the deposit limit you can set a pre-determined deposit
            amount as your maximum deposit for a certain amount of time (1 day,
            1 week, 1 month). The deposit limit comes into effect as soon as
            it's set and is valid for a pre-determined amount of time. Once the
            time runs out, the limit automatically extends for the same amount
            of time. NOTE: You can change your deposit limits by choosing a
            different amount and time period. - If you decrease your limit, it
            will come into effect immediately. - If you increase your limit, it
            will come into effect after 7 days.
          </p>
          <div className="row mt-3">
            <div className="col-12 col-sm-6">
              <Form.Group>
                <Form.Control
                  as="select"
                  size="sm"
                  type="text"
                  id="amount"
                  placeholder="Choose period"
                >
                  <option>1 day</option>
                  <option>1 week</option>
                  <option>1 month</option>
                </Form.Control>
                <small className="form-group__error-msg">Error message</small>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  size="sm"
                  type="text"
                  id="amount"
                  placeholder=" "
                />
                <label htmlFor="amount">Amount</label>
                <div className="form-group__icons">
                  <i className="icon-check"></i>
                  <i className="icon-exclamation"></i>
                </div>
                <small className="form-group__error-msg">Error message</small>
              </Form.Group>
            </div>
          </div>
          <Button className="mt-2" variant="primary">
            SET
          </Button>
        </Card.Body>
      </Accordion.Collapse>
      <i className="settings-card__icon icon-down1"></i>
    </Card>
  );
};

const SetTheWageringAmountLimitPerPeriod = ({
  active,
  order,
}: SettingProps) => {
  return (
    <Card className="settings-card">
      <Card.Header
        className={`settings-card__header ${active ? 'active' : ''}`}
      >
        <Accordion.Toggle as="a" eventKey={order} className="text-dark">
          Set the wagering amount limit per period
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={order}>
        <Card.Body className="pt-2">
          <p>
            This option allows you to set the limit on the amount you can wager
            per selected time period. Please note that after setting this limit
            you will not be able to wager more than the specified amount. Should
            you wish to reduce this amount, the changes will take effect
            immediately. However, if you want to increase or cancel the limit,
            the changes will only take effect after one week.
          </p>
          <div className="row mt-3">
            <div className="col-12 col-sm-6">
              <Form.Group>
                <Form.Control
                  as="select"
                  size="sm"
                  type="text"
                  id="amount"
                  placeholder="Turn on/off"
                >
                  <option>on</option>
                  <option>off</option>
                </Form.Control>
                <small className="form-group__error-msg">Error message</small>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  as="select"
                  size="sm"
                  type="text"
                  id="amount"
                  placeholder="Choose period"
                >
                  <option>1 day</option>
                  <option>1 week</option>
                  <option>1 month</option>
                </Form.Control>
                <small className="form-group__error-msg">Error message</small>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  size="sm"
                  type="text"
                  id="amount"
                  placeholder=" "
                />
                <label htmlFor="amount">Amount</label>
                <div className="form-group__icons">
                  <i className="icon-check"></i>
                  <i className="icon-exclamation"></i>
                </div>
                <small className="form-group__error-msg">Error message</small>
              </Form.Group>
            </div>
          </div>
          <Button className="mt-2" variant="primary">
            SET
          </Button>
        </Card.Body>
      </Accordion.Collapse>
      <i className="settings-card__icon icon-down1"></i>
    </Card>
  );
};

const SetTheWageringAmountLimitPerSession = ({
  active,
  order,
}: SettingProps) => {
  return (
    <Card className="settings-card">
      <Card.Header
        className={`settings-card__header ${active ? 'active' : ''}`}
      >
        <Accordion.Toggle as="a" eventKey={order} className="text-dark">
          Set the wagering amount limit per session
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={order}>
        <Card.Body className="pt-2">
          <p>
            This option allows you to set the limit on the amount you can wager
            during one login session. Please note that after setting this limit
            you will not be able to wager more than the specified amount. Should
            you wish to reduce this amount, the changes will take effect
            immediately. However, if you want to increase or cancel the limit,
            the changes will only take effect after one week.
          </p>
          <div className="row mt-3">
            <div className="col-12 col-sm-6">
              <Form.Group>
                <Form.Control
                  as="select"
                  size="sm"
                  type="text"
                  id="amount"
                  placeholder="Turn on/off"
                >
                  <option>on</option>
                  <option>off</option>
                </Form.Control>
                <small className="form-group__error-msg">Error message</small>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  size="sm"
                  type="text"
                  id="amount"
                  placeholder=" "
                />
                <label htmlFor="amount">Amount</label>
                <div className="form-group__icons">
                  <i className="icon-check"></i>
                  <i className="icon-exclamation"></i>
                </div>
                <small className="form-group__error-msg">Error message</small>
              </Form.Group>
            </div>
          </div>
          <Button className="mt-2" variant="primary">
            SET
          </Button>
        </Card.Body>
      </Accordion.Collapse>
      <i className="settings-card__icon icon-down1"></i>
    </Card>
  );
};

const DisablingYourAccount = ({ active, order }: SettingProps) => {
  return (
    <Card className="settings-card">
      <Card.Header
        className={`settings-card__header ${active ? 'active' : ''}`}
      >
        <Accordion.Toggle as="a" eventKey={order} className="text-dark">
          Disabling Your Account
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={order}>
        <Card.Body className="pt-2">
          <p>
            By pressing “Disable” you agree to temporarily freeze your TonyBet
            account for a pre-determined amount of time. If you choose to do so,
            you will not be able to access your betting account until the end of
            the chosen time period. As soon as this time runs out, your account
            will become active once again. If you need any further assistance
            please contact our support center: info@tonybet.com
          </p>
          <Button className="mt-2" variant="primary">
            DISABLE
          </Button>
        </Card.Body>
      </Accordion.Collapse>
      <i className="settings-card__icon icon-down1"></i>
    </Card>
  );
};

export const COMPONENTS_BY_SETTINGS = {
  [ComponentName.RequiredDocuments]: RequiredDocuments,
  [ComponentName.MarketingSettings]: MarketingSettings,
  [ComponentName.BettingLossLimits]: BettingLossLimits,
  [ComponentName.DepositLimit]: DepositLimit,
  [ComponentName.SetTheWageringAmountLimitPerPeriod]: SetTheWageringAmountLimitPerPeriod,
  [ComponentName.SetTheWageringAmountLimitPerSession]: SetTheWageringAmountLimitPerSession,
  [ComponentName.DisablingYourAccount]: DisablingYourAccount,
};

const SettingsPage = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const activeSettings = ACCOUNT_SETTINGS;
  // const { data } = useSWR<ProfileSettings>('/v2/profile.json');
  // console.log(data);
  return (
    <div className="container-fluid px-0 px-sm-4 mb-4">
      <h2 className="mb-4">My account</h2>
      <Accordion onSelect={e => setActiveKey(e)}>
        {activeSettings
          .sort((a, b) => a.order - b.order)
          .map((setting, index) => {
            const SettingsComponent = COMPONENTS_BY_SETTINGS[setting.component];
            if (activeKey === index.toString()) {
              return (
                <SettingsComponent order={index.toString()} active={true} />
              );
            } else {
              return <SettingsComponent order={index.toString()} />;
            }
          })}
      </Accordion>
    </div>
  );
};

export default SettingsPage;
