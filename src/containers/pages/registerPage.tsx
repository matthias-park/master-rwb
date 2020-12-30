import React from 'react';
import HelpBlock from '../../components/registration/HelpBlock';
import RegSelection from '../../components/registration/RegSelection';
import OnlineForm from '../../components/registration/OnlineForm';
import StoreForm from '../../components/registration/StoreForm';
import RegVerification from '../../components/registration/RegVerification';
import RegWelcome from '../../components/registration/RegWelcome';

const RegisterPage = () => {
  return (
    <main className="registration">
      <div className="reg-block">
        <RegSelection />
        <HelpBlock />
        <OnlineForm />
        <StoreForm />
        <RegVerification />
        <RegWelcome />
      </div>
    </main>
  );
};

export default RegisterPage;
