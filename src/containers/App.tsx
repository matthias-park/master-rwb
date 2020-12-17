import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
// import loadable from '@loadable/component';
// import HomePage from './pages/homePage';
import NotFoundPage from './pages/notFoundPage';
import PageLayout from './pageLayout';
import ErrorBoundary from './ErrorBoundary';
import pages from './pages';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  const routes = React.useMemo(
    () =>
      pages.map(({ protectedRoute, ...route }) => {
        const RouteEl = protectedRoute ? ProtectedRoute : Route;
        return <RouteEl key={route.path} {...route} />;
      }),
    [],
  );
  return (
    <BrowserRouter>
      <Helmet></Helmet>
      <ErrorBoundary>
        <PageLayout>
          <Switch>
            {routes}
            <Route component={NotFoundPage} />
          </Switch>
        </PageLayout>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
