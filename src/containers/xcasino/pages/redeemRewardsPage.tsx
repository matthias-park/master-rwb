import React from 'react';
import Main from '../pageLayout/Main';
import Banner from '../components/Banner';
import { useParams } from 'react-router';
import { Button, Card } from 'react-bootstrap';
import RewardsFilter from '../components/RewardsFilter';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import RedirectNotFound from '../../../components/RedirectNotFound';

const data = {
  all: Array(12).fill({
    img: 'https://via.placeholder.com/350x200',
    title: '10 Free Spins',
    subtitle: 'Book of the Dead',
    text: [
      'Wager 75x',
      'Max Cashout €100',
      'Free Spin Value €0.10',
      'Offer Ends: 31/01/2020',
    ],
    btn: {
      value: '3 Tokens',
      variant: 'primary',
    },
  }),
  spins: Array(9).fill({
    img: 'https://via.placeholder.com/350x200',
    title: '30 Free Spins',
    subtitle: 'Valley of the Gods',
    text: [
      'Wager 75x',
      'Max Cashout €100',
      'Free Spin Value €0.10',
      'Offer Ends: 31/01/2020',
    ],
    btn: {
      value: '3 Tokens',
      variant: 'primary',
    },
  }),
  bonus: Array(3).fill({
    img: 'https://via.placeholder.com/350x200',
    title: '€10.00',
    subtitle: 'Bonus',
    text: [
      'Wager 75x',
      'Max Cashout €100',
      'Free Spin Value €0.10',
      'Offer Ends: 31/01/2020',
    ],
    btn: {
      value: '3 Tokens',
      variant: 'primary',
    },
  }),
  cash: Array(3).fill({
    img: 'https://via.placeholder.com/350x200',
    title: '€30.00',
    subtitle: 'Real Money',
    text: [
      'Wager 75x',
      'Max Cashout €100',
      'Free Spin Value €0.10',
      'Offer Ends: 31/01/2020',
    ],
    btn: {
      value: '3 Tokens',
      variant: 'primary',
    },
  }),
};

const RedeemRewardsPage = () => {
  const { category } = useParams<{ category: string }>();
  const desktopWidth = useDesktopWidth(992);

  if (!data[category]) {
    return <RedirectNotFound />;
  }

  return (
    <Main
      title="Lucky Rewards"
      icon="icon-rewards"
      className="redeem-rewards-page"
      isRewards
    >
      <Banner zone="welcome" />
      {!desktopWidth && <RewardsFilter />}
      <div className="redeem-rewards-page__cards">
        {data[category].map(card => (
          <Card>
            <Card.Img src={card.img} />
            <Card.Body>
              <Card.Title>{card.title}</Card.Title>
              <Card.Subtitle>{card.subtitle}</Card.Subtitle>
              <hr className="divider-solid-light w-75"></hr>
              <Card.Text>
                {card.text.map(line => (
                  <p>{line}</p>
                ))}
              </Card.Text>
              <Button className="rounded-pill" variant={card.btn.variant}>
                {card.btn.value}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className="redeem-rewards-page__footer">
        <p className="redeem-rewards-page__footer-text">
          From now on, you will be rewarded for your game in our Lucky REWARDS
          CARNIVAL. Each bet on your favorite slots will count towards and fill
          your LuckyCoins account.
        </p>
        <p className="redeem-rewards-page__footer-text">
          With your collected LuckyCoins you can shop in the REWARDS CARNIVAL
          Shop for additional free spins, bonuses, real money credits or
          exclusive items such as vouchers for your next supermarket visit.
        </p>
        <p className="redeem-rewards-page__footer-text">
          You can find out how many LuckyCoins you receive by checking your
          LuckyClub status. Depending on your status, collecting coins can be up
          to 10 times faster.
        </p>
        <p className="redeem-rewards-page__footer-text">
          You can see your personal LuckyCoins balance in your account overview
          and displayed above the REWARDS CARNIVAL Shop. So you always have an
          eye on the bonus you can sweeten your day with.
        </p>
      </div>
    </Main>
  );
};

export default RedeemRewardsPage;
