import React, { useState } from 'react';

const Card = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card">
      <div className="card-header" onClick={() => setExpanded(!expanded)}>
        {title}
      </div>

      <div className={`collapse ${expanded ? 'show' : ''}`}>
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
};

const FaqPage = () => {
  return (
    <div className="center-container">
      <h1 className="promo-heading-small page-heading">
        Frequently asked questions
      </h1>
      <div id="accordion">
        <Card title="How do I register?">
          <p>It is very easy to set up a new TonyBet account.</p>

          <ul>
            <li>
              In order to place your bets at TonyBet you must first register a
              new account. You can sign up by filling in the{' '}
              <a href="https://tonybet.com/register/onestep/1">
                {' '}
                player registration{' '}
              </a>{' '}
              form. It is very important that you provide us with correct
              personal information so that we can provide you with the best
              online betting services.
            </li>
            <li>
              According to the regulations that govern TonyBet, all players must
              provide a valid ID (a colour picture of a passport, an identity
              card, or a driver’s licence). The time period within which you
              must upload this document will be visible in your TonyBet account
              once you are logged in.
            </li>
            <li>
              The company reserves the right to deny customers who provide false
              information as well as refuse them the payment of any winnings
              and/or money withdrawal requests. At any time the company may
              request additional information from any user. Upon request, the
              user is obligated to provide an official document in order to
              prove their identity such as a passport, driver's license or
              identity card.
            </li>
            <li>
              Once the user has registered and was approved by TonyBet, they
              will be provided with an account to be used by the registered
              person only.
            </li>
          </ul>
        </Card>

        <Card title="How do I deposit and withdraw money?">
          <p>
            TonyBet offers a great number of methods to deposit and withdraw
            your money. We are also constantly searching for new and better
            payment methods to be added to our system.
          </p>

          <p>
            For more information on all available deposit and withdrawal
            options, visit the{' '}
            <a href="https://tonybet.com/payments/payment_methods?lang=en">
              Payment Methods
            </a>{' '}
            section, or go directly to TonyBet's{' '}
            <a href="https://tonybet.com/deposit">Deposit</a> or{' '}
            <a href="https://tonybet.com/withdraw">Withdrawal</a> sections.
          </p>
          <p>How do I cancel a withdrawal request?</p>

          <p>
            If you want to cancel your withdrawal request, you are able to do it
            before it is processed. Click on your username &gt; withdrawal, then
            choose the withdrawal request that you want to cancel. Your money
            will be transferred back to your gaming account within a few
            minutes.
          </p>
          <p>
            Note: You must be a registered TonyBet user to deposit/withdrawal
            money at TonyBet.
          </p>
        </Card>

        <Card title="How do I place a bet?">
          <p>
            To bet on a single event choose the betting market from the 'Sports
            Categories' on the TonyBet homepage, or simply click on one of the
            odds available in the 'Popular Bets' or 'Last Minute Bets' sections.
            Once you find the event, click on the selection you want to bet on
            and your pick will automatically appear in the Bet Slip.
          </p>
          <p>
            Once your bet is in the Bet Slip, you can enter the amount of money
            you wish to wager on your selection by typing a number into the
            'Stake' box. You can add up to 8 single bets on one Bet Slip. As
            soon as you are satisfied with your selection, click 'Confirm'.
          </p>

          <p>
            Note: You must be a registered TonyBet user in order to place bets.
          </p>
        </Card>

        <Card title="How do I place a Multibet?">
          <p>
            In order to place a multibet, you must first select at least two
            different outcomes of different events. This will enable the
            Multibet tab in your Bet Slip in the top right corner of the page.
            You can now navigate using the 'Sports Categories' menu on the
            homepage or by browsing through the markets in the 'Popular Bets'
            and 'Last Minute Bets'. Add your bets to the Multibet Bet Slip by
            clicking on the odds you wish to bet on.
          </p>

          <p>
            As you add bets to your Bet Slip you will notice the 'Total Odds'
            changing. Once you have added your bets to the Multibet Bet Slip you
            can enter the amount of money you wish to wager on your selection by
            typing the amount into the 'Stake' box.
          </p>

          <p>
            You can add up to 30 bets to your Multibet. If you add more bets to
            the slip you will notice the 'Potential Winnings' change according
            to the 'Total Odds'. Once you enter all the bets, check to see if
            you‘re satisfied with your selection, and if you are, click
            'Confirm'.
          </p>

          <p>
            Note: You must be a registered TonyBet user in order to place bets.
          </p>
        </Card>

        <Card title="How do I place a System bet?">
          <p>
            In order to place a system bet, you must first select at least three
            different outcomes of different events. This will enable the System
            tab in your Bet Slip in the top right corner of the page. You can
            now navigate using the 'Sports Categories' menu on the homepage or
            by browsing through the markets in the 'Popular Bets' and 'Last
            Minute Bets'. Add your bets to the System Bet Slip by clicking on
            the odds you wish to bet on.
          </p>

          <p>
            Once you have added your bets to the System Bet Slip you can enter
            the amount of money you wish to wager on your selection by typing
            the amount into the 'Stake' box. Below the 'Stake' box you will see
            check boxes that allow you to select the type of system you wish to
            bet on.
          </p>

          <p>
            You can add up to eight bets to your System bet. If you add more
            bets to the slip you will notice the 'Potential Winnings' change
            along with the types of Systems available for betting. As you change
            the System bet type you will notice your 'Overall Stake' and
            'Potential Winnings' change as well. Once you enter all the bets,
            check to see if you‘re satisfied with your selection, and if you
            are, click 'Confirm'.
          </p>

          <p>
            Note: You must be a registered TonyBet user in order to place bets.
          </p>
        </Card>

        <Card title="How long does it take for bets to be settled?">
          <p>
            We aim to settle your bets as quickly as possible. Our customers are
            our highest priority at TonyBet and therefore we do our best to
            process all the bets in time. A delay could occur due to the
            requirement of official validation for the outcome of the event.
            Should you encounter any issues with the settlement of your bets,
            please contact our{' '}
            <a href="https://tonybet.com/contacts"> customer service</a>{' '}
            department who will rectify this as soon as possible.
          </p>
        </Card>

        <Card title="How do I follow my transactions, current bets and results?">
          <p>
            As a registered user you can follow all of your transactions, bets
            in play and results at any time through the following options:
          </p>

          <ul>
            <li>
              <a href="https://tonybet.com/transactions">Transactions</a>
            </li>
            <li>
              <a href="https://tonybet.com/bets">Betting history</a>
            </li>
          </ul>
        </Card>

        <Card title="How do I adjust my account settings?">
          <p>
            By clicking your username button and selecting ‘Profile’, you can
            view your account settings as well as upload documents, change your
            password, limit your losses, deposits, and wager amounts;
            self-exclude yourself from gambling at TonyBet and disable your
            account.
          </p>
        </Card>

        <Card title="Is my data safe at TonyBet?">
          <p>
            TonyBet takes your privacy and security very seriously. All data and
            personal information is protected by the industry leading security
            features and encryption methods. Visit the{' '}
            <a href="https://tonybet.com/security">Security &amp; Privacy</a>{' '}
            page to find out more.
          </p>
        </Card>

        <Card title="What is Event of the Day?">
          <p>
            Event of the Day is a selection of the most important events of the
            day with better (bigger) odds. To get those odds you must combine a
            certain number of outcomes from different events, which are
            indicated above the event name in the{' '}
            <a href="https://tonybet.com/event-of-the-day">Event of the Day</a>{' '}
            section. You can’t use the improved odds for single bets or
            combinations made of fewer outcomes than required.
          </p>
        </Card>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return { props: {} };
}

export default FaqPage;
