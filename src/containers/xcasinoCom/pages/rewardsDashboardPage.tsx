import React from 'react';
import Main from '../pageLayout/Main';
import { Button, Card } from 'react-bootstrap';
import CasinoGroupSlider from '../components/casino/CasinoGroupSlider';

const cardContent = [
  {
    title: '€ 180.50',
    subtitle: 'Balance',
    btnValue: 'Deposit',
    btnVariant: 'primary',
  },
  {
    title: 'Club',
    subtitle: 'Loyalty Program',
    btnValue: 'More',
    imgSrc: 'https://via.placeholder.com/350x250',
    btnVariant: 'secondary',
  },
];

const bonusCodeHistory = ['Cash', 'Welcome 2020', 'Book of the Dead'];

const DashboardCard = ({
  title,
  imgSrc,
  subtitle,
  btnVariant,
  btnValue,
}: {
  title: string;
  imgSrc?: string;
  subtitle: string;
  btnValue: string;
  btnVariant?: string;
}) => {
  return (
    <Card className="dashboard-card">
      {!!imgSrc && <Card.Img src={imgSrc} />}
      <Card.Body>
        <div>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{subtitle}</Card.Text>
        </div>
        <Button variant={btnVariant} className="rounded-pill">
          {btnValue}
        </Button>
      </Card.Body>
    </Card>
  );
};

const RewardsDashboardPage = () => {
  return (
    <Main title="Dashboard" icon="icon-dashboard">
      <div className="dashboard-page fade-in">
        <div className="dashboard-page__cards">
          <div className="dashboard-page__cards-row">
            {Array(3)
              .fill(cardContent[0])
              .map(content => {
                return (
                  <DashboardCard
                    title={content.title}
                    imgSrc={content.imgSrc}
                    subtitle={content.subtitle}
                    btnVariant={content.btnVariant}
                    btnValue={content.btnValue}
                  />
                );
              })}
          </div>
          <div className="dashboard-page__cards-row">
            {Array(3)
              .fill(cardContent[1])
              .map(content => {
                return (
                  <DashboardCard
                    title={content.title}
                    imgSrc={content.imgSrc}
                    subtitle={content.subtitle}
                    btnVariant={content.btnVariant}
                    btnValue={content.btnValue}
                  />
                );
              })}
          </div>
          <Card className="dashboard-page__large-card">
            <Card.Body>
              <Card.Text>Last used bonus codes: </Card.Text>
              {bonusCodeHistory.map(code => {
                return <Button size="sm">{code}</Button>;
              })}
            </Card.Body>
          </Card>
        </div>
        <div className="dashboard-page__attractions">
          <CasinoGroupSlider className="expand-right" />
          <CasinoGroupSlider className="expand-right" />
          <CasinoGroupSlider className="expand-right" />
        </div>
      </div>
    </Main>
  );
};

export default RewardsDashboardPage;
