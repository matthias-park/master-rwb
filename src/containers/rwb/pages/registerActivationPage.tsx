import React, { useEffect } from 'react';
import RegActivation from '../components/registration/RegActivation';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const RegisterActivationPage = () => {
  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!!user.id) {
      history.push('/');
    }
  }, [user.id]);

  return (
    <main className="registration">
      <div className="reg-block">
        <RegActivation />
      </div>
    </main>
  );
};

export default RegisterActivationPage;
