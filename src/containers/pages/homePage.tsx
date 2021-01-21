import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Redirect } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <Redirect to="/sports" />
      <span>HomePage container</span>
    </>
  );
};

export default HomePage;
