import React from 'react';

const SportsPage = () => {
  return (
    <iframe
      title="iframe"
      style={{ width: '100vw', height: '100vh' }}
      scrolling="no"
      frameBorder="0"
      id="tonysportsbookiframe"
      name="tonysportsbookiframe"
      src="/iframe/tonybetSB.html"
    />
  );
};
export async function getStaticProps() {
  return { props: {} };
}
export default SportsPage;
