import React, { useRef, useEffect, useReducer } from 'react';
import clsx from 'clsx';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useRoutePath } from '../../../../hooks';
import { PagesName } from '../../../../constants';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import { useAuth } from '../../../../hooks/useAuth';
import { StyledCasinoFilters } from '../styled/casinoStyles';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { SearchActions } from '../../../../types/api/Casino';
import throttle from 'lodash.throttle';
import { scrollContainerBy } from '../../../../utils/uiUtils';
import { ThemeSettings } from '../../../../constants';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';
import { sortAscending } from '../../../../utils';

enum OverflowState {
  Right = 1,
  Left,
  Unset,
}

const overflowReducer = (state, action) => {
  switch (action.type) {
    case OverflowState.Right:
      return { ...state, right: action.payload };
    case OverflowState.Left:
      return { ...state, left: action.payload };
    case OverflowState.Unset:
      return { right: false, left: false };
    default:
      return state;
  }
};

const CategoriesFilter = ({ useSimpleFilters }) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const categoriesContainerRef = useRef<HTMLUListElement | null>(null);
  const [categoriesOverflow, setCategoriesOverflow] = useReducer(
    overflowReducer,
    {
      right: false,
      left: false,
    },
  );
  const { casinoType, categories, activeCategory } = useCasinoConfig();
  const history = useHistory();
  const location = useLocation();
  const params = useParams<{ category?: string; provider?: string }>();
  const lobbyPath = useRoutePath(PagesName.CasinoPage);
  const tablet = useDesktopWidth(991);
  const { setParams, setSearchData } = useCasinoConfig();
  //@ts-ignore
  const { icons: icon } = ThemeSettings!;

  useEffect(() => {
    window.addEventListener('resize', throttleOverflowHandler);
    return () => window.removeEventListener('resize', throttleOverflowHandler);
  });

  useEffect(() => {
    checkCategoriesOverflow();
  }, [categories]);

  useEffect(() => {
    setParams(params);
  }, []);

  const checkCategoriesOverflow = () => {
    const el = categoriesContainerRef.current;
    if (el && Math.round(el.offsetWidth + el.scrollLeft) < el.scrollWidth) {
      setCategoriesOverflow({ type: OverflowState.Right, payload: true });
    } else {
      setCategoriesOverflow({ type: OverflowState.Right, payload: false });
    }
    if (el && el.scrollLeft !== 0) {
      setCategoriesOverflow({ type: OverflowState.Left, payload: true });
    } else {
      setCategoriesOverflow({ type: OverflowState.Left, payload: false });
    }
    if (el && el.offsetWidth >= el.scrollWidth) {
      setCategoriesOverflow({ type: OverflowState.Unset });
    }
  };

  const throttleOverflowHandler = throttle(checkCategoriesOverflow, 200);

  const linkToCategory = categoryData => {
    history.push(
      `/${casinoType}${categoryData ? `/${categoryData.slug}` : ''}`,
      { scrollPosition: window.scrollY },
    );
  };

  return useSimpleFilters ? (
    <div className="simple-casino-filters">
      <Dropdown>
        <Dropdown.Toggle className="simple-casino-filters__select">
          {activeCategory?.name || t('casino_game_category')}
          <i className={clsx(icon?.down)}></i>
        </Dropdown.Toggle>
        <Dropdown.Menu className="simple-casino-filters__menu">
          {categories.map(category => {
            return (
              <Dropdown.Item
                key={category.id}
                onClick={() => linkToCategory(category)}
                className="simple-casino-filters__menu-item"
              >
                {category.name}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      <Form.Group className="simple-casino-filters__search">
        <i className={clsx(icon?.search, 'icon')}></i>
        <input
          type="text"
          placeholder={t('casino-game-search')}
          className="simple-casino-filters__search-input"
        />
      </Form.Group>
    </div>
  ) : (
    <div className="categories-wrp">
      <ul
        className="categories"
        ref={categoriesContainerRef}
        onScroll={throttleOverflowHandler}
      >
        {tablet && (
          <li
            className={clsx(
              'categories-item',
              `category-${lobbyPath.slice(1)}`,
              location.pathname === lobbyPath && 'active',
            )}
            onClick={() => linkToCategory(null)}
          >
            <i className={clsx(icon?.home)} />
            {t('casino_lobby_category')}
          </li>
        )}
        {categories
          ?.sort((a, b) => sortAscending(a.order_id, b.order_id))
          .map(category => (
            <li
              key={`${category?.id}`}
              className={clsx(
                'categories-item',
                category.slug === activeCategory?.slug && 'active',
              )}
              onClick={() => linkToCategory(category)}
            >
              <img
                className="category-image"
                src={category.image}
                alt="category-img"
              />
              {category.name}
            </li>
          ))}
        {user.logged_in && tablet && (
          <>
            <li
              className={clsx(
                'categories-item',
                params.category === 'favourite' && 'active',
              )}
              onClick={() => linkToCategory({ slug: 'favourite' })}
            >
              <i className={clsx(icon?.favorite)} />
              {t('casino_favourite_category')}
            </li>
          </>
        )}
        <li
          className={clsx('categories-item', 'category-search')}
          onClick={() => setSearchData({ type: SearchActions.Show })}
        >
          <i className={clsx(icon?.search)}></i>
          {t('search_title')}
        </li>
      </ul>
      {categoriesOverflow.right && (
        <div
          className="scroll-right-wrp"
          onClick={() => scrollContainerBy(categoriesContainerRef, 200)}
        >
          {/* <i className={clsx(icon?.right, 'scroll-more')}></i> */}
        </div>
      )}
      {categoriesOverflow.left && (
        <div
          className="scroll-left-wrp"
          onClick={() => scrollContainerBy(categoriesContainerRef, -200)}
        >
          {/* <i className={clsx(icon?.left, 'scroll-more')}></i> */}
        </div>
      )}
    </div>
  );
};

const CasinoFilters = () => {
  const useSimpleFilters = false;

  return (
    <>
      <StyledCasinoFilters>
        <CategoriesFilter useSimpleFilters={useSimpleFilters} />
      </StyledCasinoFilters>
    </>
  );
};

export default CasinoFilters;
