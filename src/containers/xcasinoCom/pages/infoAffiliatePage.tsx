import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import Accordion from 'react-bootstrap/esm/Accordion';
import Main from '../pageLayout/Main';
import clsx from 'clsx';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import { Swiper, SwiperSlide } from 'swiper/react';

const data = {
  banner: {
    img: '/xcasino/images/info/affiliateBanner.png',
    img_mobile: '/xcasino/images/info/affiliateBanner-mobile.png',
    title: 'Become',
    subtitle: 'A Lucky Affiliate',
    text:
      'Join our affiliate program we have great payment option and amazing offers',
    btnValue: 'Join Us',
  },
  info: {
    text: [
      {
        title: 'About us',
        text:
          'LuckyCASINO is live since 2013. With new platform, new games and MGA License we´re conquering the market!,An exclusive games selection, outstanding support and great payment options are just a small part of our amazing offer',
      },
      {
        title: 'Your Commision',
        text:
          'RevShare, CPA, Hybrid: Let´s talk about! There are no strict schedules, all Deals are negotiated individually. Your favourite Deal is only a Mouseclick away!',
      },
      {
        title: 'Why Lucky Casino',
        text:
          'More than 2529 Games from Netent, Play´n Go, Gamomat and Lionline... Payment Methods like PayPal, Trustly, Klarna, Skrill and many more... Dedicated VIP Program... Fast Payouts... Optimized LPs and Creatives... Exclusive Options... Doesn´t matter if SEO, PPC, Social, Streaming or Email - We know exactly what you need to succeed!',
      },
    ],
    images: [
      {
        img: '/xcasino/images/info/airhorn.png',
        text: 'High converting\n Creatives',
      },
      {
        img: '/xcasino/images/info/vip.png',
        text: 'Loyal Players\n and VIP Program',
      },
      {
        img: '/xcasino/images/info/payment.png',
        text: 'Fast payouts\n(Youll have it on 15th each month)',
      },
    ],
  },
  tesimonials: {
    title: 'TESTIMONIALS / PARTNERS',
    cards: [
      {
        reviewer: 'Gamblejoe.com',
        review:
          'We’re working with Luckycasino since 2013 and they’re improving year after year. It’s really outstanding to have such a long-lasting partnership in this industry. Their Affiliate Managers are always easy and fast to deal with. If you’re looking for a good converting and reliable partner Luckycasino is for you',
      },
      {
        reviewer: 'Webcasinos.com',
        review:
          'The Lucky Casino affiliate program is one of the best in this industry, due to the very good game selection it is popular with players and converts outstanding. The Lucky Casino affiliate program is an absolute recommendation especially in German-speaking countries.',
      },
      {
        reviewer: 'Onlinecasino.de',
        review:
          'Luckycasino is an appreciated partner to us and we look forward to many fruitful years together with Luckycasino! The brand is easy to promote and the affiliate managers are always very helpful with whatever you might need. We recommend all other affiliates to start working with this a-class team and are certain that all people in this industry will make great profit with Luckycasino.',
      },
    ],
  },
  faq: {
    title: 'FAQ',
    questions: [
      {
        question: '1. What’s Luckycasino Affiliates?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '2. Why should I become an Affiliate?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '3. OK sounds great. How do I sign up?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '4. I have an Account, how do I get started?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '5. Let’s be honest, do I have to pay anything?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question:
          '6. But I still have some questions left, can anybody help me?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '7. And the T&Cs, where are they?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '8. Where can I see my earnings?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '9. How long do I own a Player and earn commissions?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '10. How much can i earn?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '11. When do I get my money?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '12. How do I get paid?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '13.  Where do I get my Links from?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '14. How do you track my players?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '15. Oh no, my Account shows negative Balance ?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
      {
        question: '16. Oops forgot my password?',
        answer:
          'When you have a website, Facebook Group, Twitch Channel or any other form of traffic it’s a great option to earn good money.',
      },
    ],
  },
};

const InfoAffiliatePage = () => {
  const desktopWidth = useDesktopWidth(576);
  const [activeAccordion, setActiveAccordion] = useState<string>();
  return (
    <Main
      title="Information"
      icon="icon-circle-info"
      className="info-affiliate-page"
    >
      <div className="info-affiliate-page__banner">
        <img
          className="info-affiliate-page__banner-image d-none d-sm-block"
          src={data.banner.img}
          alt=""
        />
        <img
          className="info-affiliate-page__banner-image-mob d-block d-sm-none"
          src={data.banner.img_mobile}
          alt=""
        />
        <div className="info-affiliate-page__banner-content">
          <h3 className="info-affiliate-page__banner-title">
            {data.banner.title}
          </h3>
          <h3 className="info-affiliate-page__banner-subtitle">
            {data.banner.subtitle}
          </h3>
          <p className="info-affiliate-page__banner-text d-none d-md-block">
            {data.banner.text}
          </p>
          <Button
            className="info-affiliate-page__banner-btn rounded-pill d-none d-md-block"
            variant="secondary"
          >
            {data.banner.btnValue}
          </Button>
          <i className="icon-left d-flex d-md-none"></i>
        </div>
      </div>
      <div className="info-affiliate-page__wrp">
        <div className="info-affiliate-page__info section">
          {data.info.text.map(section => (
            <>
              <h6 className="info-affiliate-page__info-title">
                {section.title}
              </h6>
              <p className="info-affiliate-page__info-text">{section.text}</p>
            </>
          ))}
          <div className="info-affiliate-page__info-images">
            {data.info.images.map(section => (
              <div className="info-affiliate-page__info-image">
                <img src={section.img} alt="" className="image" />
                <p className="text">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="info-affiliate-page__tesimonials section">
          <h4 className="section-title">{data.tesimonials.title}</h4>
          <div className="info-affiliate-page__tesimonials-cards">
            {desktopWidth ? (
              data.tesimonials.cards.map(card => (
                <Card>
                  <Card.Body>
                    <div>
                      <p className="card-quotation-left">“</p>
                      <p className="info-affiliate-page__tesimonials-review">
                        {card.review}
                      </p>
                      <p className="card-quotation-right">“</p>
                    </div>
                    <h6 className="info-affiliate-page__tesimonials-reviewer">
                      {card.reviewer}
                    </h6>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <Swiper
                slidesPerView={1}
                spaceBetween={0}
                slidesPerGroup={1}
                loop
                grabCursor
                effect="slide"
              >
                {data.tesimonials.cards.map(card => (
                  <SwiperSlide>
                    <Card>
                      <Card.Body>
                        <div>
                          <p className="card-quotation-left">“</p>
                          <p className="info-affiliate-page__tesimonials-review">
                            {card.review}
                          </p>
                          <p className="card-quotation-right">“</p>
                        </div>
                        <h6 className="info-affiliate-page__tesimonials-reviewer">
                          {card.reviewer}
                        </h6>
                      </Card.Body>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
        <div className="info-affiliate-page__faq section">
          <h4 className="section-title">{data.faq.title}</h4>
          <Accordion>
            {data.faq.questions.map((item, index) => {
              const key = String(index);
              return (
                <Card>
                  <Accordion.Toggle
                    className={clsx(
                      'accordion-toggle',
                      activeAccordion === key && 'active',
                    )}
                    onClick={() =>
                      activeAccordion === key
                        ? setActiveAccordion('')
                        : setActiveAccordion(key)
                    }
                    eventKey={String(index)}
                  >
                    {item.question}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={key}>
                    <Card.Body>{item.answer}</Card.Body>
                  </Accordion.Collapse>
                </Card>
              );
            })}
          </Accordion>
        </div>
        <div className="info-affiliate-page__footer">
          <h3>Still have some questions?</h3>
          <Button className="rounded-pill" variant="secondary">
            Contact Us
          </Button>
        </div>
      </div>
    </Main>
  );
};

export default InfoAffiliatePage;
