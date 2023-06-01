import React, { useEffect, useState, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import CasinoGroupSlider from '../components/casino/CasinoGroupSlider';
import Main from '../pageLayout/Main';
import { postApi } from '../../../utils/apiUtils';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { useParams } from 'react-router-dom';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import { useHistory } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Game } from '../../../types/api/Casino';

type GameInfoPage = {
  game: Game;
  id: number;
  image: string;
  langauge: string;
  text: string;
  main_text: string;
  slug: string;
  title: string;
};

const CasinoGameInfoPage = () => {
  const history = useHistory();
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<GameInfoPage | null>();
  const { providers, loadGame, categories } = useCasinoConfig();
  const gameProvider = useMemo(
    () => providers?.find(provider => provider.id === data?.game.provider.id),
    [data, providers],
  );
  const topCategory = useMemo(
    () => categories?.find(category => category.name === 'Top games'),
    [categories],
  );

  useEffect(() => {
    fetchInfoPageData();
  }, []);

  const fetchInfoPageData = async () => {
    const response: RailsApiResponse<any> = await postApi<
      RailsApiResponse<any>
    >('/restapi/v1/casino/info_page', {
      slug: slug,
    }).catch((response: RailsApiResponse<null>) => {
      setData(null);
      return response;
    });
    if (response.Success) {
      setData(response.Data[0]);
    }
  };

  const jsxRedirect = event => {
    event.preventDefault();
    if (event.target.tagName === 'A') {
      history.push(event.target.getAttribute('href'));
    } else if (event.target.closest('a')?.tagName === 'A') {
      history.push(event.target.closest('a').getAttribute('href'));
    }
  };

  return (
    <>
      {!data && (
        <div className="d-flex my-5 min-vh-70">
          <Spinner animation="border" variant="white" className="mx-auto" />
        </div>
      )}
      {!!data && (
        <Main title={data.title} icon="icon-casino-lobby">
          <div className="casino-game-info">
            <div className="casino-game-info_header">
              <div className="current-game">
                <img alt="" className="current-game__image" src={data.image} />
              </div>
              <div className="current-game__description">
                <div className="current-game__description-header">
                  <h4 className="current-game__description-title">
                    {data.title}
                  </h4>
                  <div className="current-game__description-stars"></div>
                  <div className="current-game__description-image">
                    <img alt="" src={gameProvider?.image}></img>
                  </div>
                </div>
                <hr className="divider-solid-light" />
                <div className="current-game__description-body">
                  <div className="current-game__description-btn-wrp">
                    <Button className="rounded-pill" variant="none">
                      Free Play
                    </Button>
                    <Button
                      className="rounded-pill"
                      onClick={() => loadGame(data.game)}
                    >
                      Play for Real
                    </Button>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: data.text || '' }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="casino-game-info__body">
              <div
                onClick={event => jsxRedirect(event)}
                dangerouslySetInnerHTML={{ __html: data.main_text || '' }}
              ></div>
              {topCategory && (
                <CasinoGroupSlider
                  name={topCategory.name}
                  category={{ id: topCategory.id, slug: topCategory.slug }}
                  className="expand-right"
                />
              )}
            </div>
          </div>
        </Main>
      )}
    </>
  );
};

export default CasinoGameInfoPage;
