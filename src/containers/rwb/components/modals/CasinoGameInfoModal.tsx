import React, { useMemo } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName, ThemeSettings } from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import { useAuth } from '../../../../hooks/useAuth';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import Modal from 'react-bootstrap/Modal';
import { StyledCasinoGameInfoModal } from '../styled/casinoStyles';
import Button from 'react-bootstrap/Button';
import NumberFormat from 'react-number-format';
import { replaceStringTagsReact } from '../../../../utils/reactUtils';
import clsx from 'clsx';

const CasinoGameInfoModal = () => {
  const { t } = useI18n();
  const { icons: icon } = ThemeSettings!;
  const {
    selectedGame,
    setSelectedGame,
    loadGame,
    providers,
  } = useCasinoConfig();
  const { user } = useAuth();
  const { activeModal, disableModal } = useModal();
  const providerSlug = useMemo(
    () =>
      providers.find(provider => provider.id === selectedGame?.provider.id)
        ?.slug,
    [providers],
  );

  const hideModal = () => {
    disableModal(ComponentName.CasinoGameInfoModal);
    setSelectedGame(null);
  };

  const playGame = (e, demo: boolean = false) => {
    selectedGame && loadGame(selectedGame, demo);
    disableModal(ComponentName.CasinoGameInfoModal);
  };

  return (
    <Modal
      show={activeModal === ComponentName.CasinoGameInfoModal}
      onHide={() => hideModal()}
      centered={true}
      dialogClassName="mx-650"
    >
      <StyledCasinoGameInfoModal className="styled-casino-game-info-modal">
        <i
          className={clsx(icon?.close, 'custom-modal__close')}
          onClick={hideModal}
        />
        <Modal.Body>
          <div className="info-header">
            <img
              alt=""
              className="info-header__img"
              src={selectedGame?.image}
            ></img>
            <div className="info-header__title">
              <h4>{selectedGame?.name}</h4>
              <small>{`${t(`provider_name_${providerSlug}`)} | ${
                selectedGame?.genre
              }`}</small>
            </div>
          </div>
          <div className="info-body">
            <div className="info-body__container">
              <div className="table">
                <div className="table__line">
                  <div className="table__line-item">
                    <small>{t('casino_min_bet')}</small>
                    <span>
                      {!!selectedGame?.min_bet ? (
                        <NumberFormat
                          value={selectedGame.min_bet}
                          thousandSeparator
                          displayType={'text'}
                          prefix={user.currency}
                          decimalScale={2}
                          fixedDecimalScale={true}
                        />
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>
                  <div className="table__line-item">
                    <small>{t('casino_reels')}</small>
                    <span>
                      {!!selectedGame?.reels ? selectedGame.reels : '-'}
                    </span>
                  </div>
                  <div className="table__line-item">
                    <small>{t('casino_lines')}</small>
                    <span>
                      {!!selectedGame?.paylines ? selectedGame.paylines : '-'}
                    </span>
                  </div>
                </div>
                <div className="table__line">
                  <div className="table__line-item">
                    <small>{t('casino_max_bet')}</small>
                    <span>
                      {!!selectedGame?.max_bet ? (
                        <NumberFormat
                          value={selectedGame.max_bet}
                          thousandSeparator
                          displayType={'text'}
                          prefix={user.currency}
                          decimalScale={2}
                          fixedDecimalScale={true}
                        />
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>
                  <div className="table__line-item">
                    <small>{t('casino_rtr')}</small>
                    <span>{!!selectedGame?.rtr ? selectedGame.rtr : '-'}</span>
                  </div>
                  <div className="table__line-item">
                    <small>{t('casino_max_payout')}</small>
                    <span>
                      {!!selectedGame?.max_payout ? (
                        <NumberFormat
                          value={selectedGame.max_payout}
                          thousandSeparator
                          displayType={'text'}
                          prefix={user.currency}
                          decimalScale={2}
                          fixedDecimalScale={true}
                        />
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {selectedGame?.volatility && (
                <img
                  alt=""
                  src={`/assets/images/casino/volatility-${selectedGame.volatility}.png`}
                  className="volatility"
                ></img>
              )}
            </div>
            <div className="info-body__buttons">
              <Button variant="primary" onClick={playGame}>
                {user.logged_in ? t('play') : t('play_logged_out')}
              </Button>
              <Button variant="secondary" onClick={e => playGame(e, true)}>
                {t('try')}
              </Button>
            </div>
            {selectedGame?.short_description && (
              <p className="info-body__description">
                {replaceStringTagsReact(selectedGame?.short_description)}
              </p>
            )}
          </div>
        </Modal.Body>
      </StyledCasinoGameInfoModal>
    </Modal>
  );
};

export default CasinoGameInfoModal;
