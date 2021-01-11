import React, { useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';

export interface KambiSportsbookProps {
  locale: string;
  playerId: string;
  ticket: string;
  getApiBalance: string;
  currency: string;
  market: string;
}

interface Props extends KambiSportsbookProps {
  updateBalance: () => void;
}

let insertLock = false;
const insertKambiBootstrap = (containerRef: HTMLDivElement): void => {
  if (insertLock) return;
  insertLock = true;
  Promise.resolve(disposeKambiBootstrap()).then(() => {
    const id = 'kambi-bootstrap';
    if (document.getElementById(id)) return;
    const kambiSB = document.createElement('div');
    kambiSB.id = 'KambiBC';
    const s = document.createElement('script');
    s.id = id;
    s.setAttribute(
      'src',
      'https://ctn-static.kambi.com/client/bnlbe/kambi-bootstrap.js?cb=' +
        new Date().getTime(),
    );
    containerRef.after(kambiSB);
    kambiSB.after(s);
    setTimeout(() => (insertLock = false), 500);
  });
};
const disposeKambiBootstrap = () => window._kbc?.dispose?.();

const KambiSportsbook = React.memo(
  (params: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      window.customerSettings = {
        getBalance: function (successFunc, failureFunc, $) {
          $.ajax({
            url: params!.getApiBalance,
            success: function (response) {
              successFunc(parseFloat(response));
            },
            error: function (xhr) {
              failureFunc(xhr);
            },
          });
        },
        notification: event => {
          if (event.name === 'placedBet') {
            params.updateBalance();
          }
          // console.log(event);
        },
        enableOddsFormatSelector: true,
      };
      window._kc = {
        currency: params.currency,
        locale: params.locale,
        market: params.market,
        playerId: params.playerId,
        ticket: params.ticket,
        oddsFormat: 'decimal',
        streamingAllowedForPlayer: 'false',
        racingMode: 'false',
      };
      setTimeout(() => {
        if (containerRef.current) {
          insertKambiBootstrap(containerRef.current!);
        }
      }, 500);
      return () => disposeKambiBootstrap();
    }, [containerRef, params]);

    return <div ref={containerRef}></div>;
  },
  (prev, next) => isEqual(prev, next),
);

export default KambiSportsbook;