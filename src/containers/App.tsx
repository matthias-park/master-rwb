import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import loadable from '@loadable/component';
import HomePage from './pages/homePage';
import NotFoundPage from './pages/notFoundPage';
import PageLayout from './pageLayout';
import CookiePolicyPage from './pages/cookiePolicyPage';
import PromotionsPage from './pages/promotionsPage';
import SportsPage from './pages/sportsPage';
import BonusPage from './pages/bonusPage';
import DepositPage from './pages/depositPage';
import LimitsPage from './pages/limitsPage';
import SettingsPage from './pages/settingsPage';
import WithdrawalPage from './pages/withdrawalPage';
import ErrorBoundary from './ErrorBoundary';
import ProtectedRoute from './ProtectedRoute';

const LoadableFaqPage = loadable(() => import('./pages/faqPage'));
const LoadableLoginPage = loadable(() => import('./pages/loginPage'));
const LoadableRegisterPage = loadable(() => import('./pages/registerPage'));

const App = () => {
  return (
    <BrowserRouter>
      <Helmet></Helmet>
      <ErrorBoundary>
        <PageLayout>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/cookie-policy" component={CookiePolicyPage} />
            <Route exact path="/faq" component={LoadableFaqPage} />
            <Route exact path="/sports" component={SportsPage} />
            <Route exact path="/login" component={LoadableLoginPage} />
            <Route exact path="/register" component={LoadableRegisterPage} />
            <Route exact path="/promotions" component={PromotionsPage} />
            <ProtectedRoute exact path="/bonus" component={BonusPage} />
            <ProtectedRoute exact path="/deposit" component={DepositPage} />
            <ProtectedRoute exact path="/limits" component={LimitsPage} />
            <ProtectedRoute exact path="/settings" component={SettingsPage} />
            <ProtectedRoute
              exact
              path="/withdrawal"
              component={WithdrawalPage}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </PageLayout>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
