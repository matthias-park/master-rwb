import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { useConfig } from '../../../hooks/useConfig';
import LoginForm from '../components/LoginForm';
import clsx from 'clsx';
import { useModal } from '../../../hooks/useModal';
import { ComponentName } from '../../../constants';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';

const LoginPage = () => {
  const { user } = useAuth();
  const { cookies } = useConfig();
  const { enableModal } = useModal();
  const location = useLocation<{
    from?: string;
    protectedRoute?: boolean;
  } | null>();
  const history = useHistory();
  const message = new URLSearchParams(location.search).get('message');
  const { selectedGame, loadGame } = useCasinoConfig();

  useEffect(() => {
    const fromPathname = location.state?.from;
    if (user.logged_in && !!user.id) {
      history.push(fromPathname || '/');
      if (message && selectedGame) {
        loadGame(selectedGame);
      }
    }
  }, [user.logged_in, history, location]);

  useEffect(() => {
    if (
      !cookies.accepted &&
      window.__config__.componentSettings?.login?.loginCookiesAccept
    ) {
      enableModal(ComponentName.CookiesModal);
    }
  }, []);

  return (
    <main className="page-container">
      <div className={clsx('page-inner page-inner--small login')}>
        <img
          className="page-inner__title"
          src="/assets/images/container-bg-img.png"
          alt="login-bg"
        />
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
