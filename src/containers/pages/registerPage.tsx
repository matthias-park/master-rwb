import React from 'react';
import HelpBlock from '../../components/HelpBlock';
import RegSelection from '../../components/registration/RegSelection';
import OnlineForm from '../../components/registration/OnlineForm';
import StoreForm from '../../components/registration/StoreForm';
import RegVerification from '../../components/registration/RegVerification';
import RegWelcome from '../../components/registration/RegWelcome';

const RegisterPage = () => {
  return (
    <main className="registration">
      <div className="reg-block">
        <RegSelection/>
        <HelpBlock title="Hulp nodig?" blocks={['faq', 'phone', 'email']}/>
        <OnlineForm/>
        <StoreForm/>
        <RegVerification/>
        <RegWelcome/>
      </div>
    </main>
  )
};

export default RegisterPage;
