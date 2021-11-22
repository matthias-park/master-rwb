import React from 'react';
import { Button } from 'react-bootstrap';

const NotFoundPage = () => {
  return (
    <div className="not-found-page min-vh-70 p-2">
      <div className="not-found-page__main">
        <h3>Hmmm... Something went wrong</h3>
        <p>
          Follow your instinct or one of the links below to find what you are
          looking for.
        </p>
        <div className="not-found-page__btns">
          <Button className="rounded-pill" as={'a'} href="/">
            Home
          </Button>
          <Button className="rounded-pill" as={'a'} href="/info/faq">
            FAQ
          </Button>
          <Button className="rounded-pill" as={'a'} href="/info/support">
            Help
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
