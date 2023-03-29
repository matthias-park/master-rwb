import React, { useState, useRef, useEffect, useMemo } from 'react';
import { snakeCase } from '../../../../utils/reactUtils';
import clsx from 'clsx';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useRoutePath } from '../../../../hooks';
import { PagesName } from '../../../../constants';
import Button from 'react-bootstrap/Button';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import { useAuth } from '../../../../hooks/useAuth';
import {
  StyledCasinoFilters,
  StyledCasinoFiltersMenu,
} from '../styled/casinoStyles';
import { Config } from '../../../../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import {
  Provider,
  FilterActions,
  SearchActions,
} from '../../../../types/api/Casino';
import throttle from 'lodash.throttle';

interface FilterDropdownProps {
  title: string;
  toggleTitle?: string;
  resetFilter: () => void;
  items: {
    activeId: string | number;
    name: string;
    onClick: () => void;
  }[];
  activeItemId?: string | number | null;
}

interface MultiFilterDropdownProps {
  title: string;
  resetFilter: () => void;
  filtersSelected?: number;
  items:
    | {
        name: string;
        isChecked: boolean;
        onClick: () => void;
      }[]
    | false;
}

const FilterDropdown = ({
  title,
  toggleTitle,
  resetFilter,
  items,
  activeItemId,
}: FilterDropdownProps) => {
  const [show, setShow] = useState(false);

  const removeFilter = e => {
    if (activeItemId) {
      e.stopPropagation();
      resetFilter();
    }
  };

  return (
    <Dropdown className="filter-dropdown" onToggle={isOpen => setShow(isOpen)}>
      <p className="filter-title">{title}</p>
      <div className="filter-block">
        <Dropdown.Toggle
          as="div"
          bsPrefix="filter-toggle"
          className={clsx(!show && activeItemId && 'active')}
        >
          {toggleTitle || ''}
          <span className="icon-wrp" onClick={e => removeFilter(e)}>
            <i
              className={clsx(
                `icon-${Config.name}-${
                  !show && activeItemId ? 'plus' : 'down'
                }`,
              )}
            />
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu flip={false} bsPrefix="filter-menu">
          {items
            ?.filter(item => item)
            .map(
              (item, i) =>
                activeItemId !== item.activeId && (
                  <Dropdown.Item
                    key={`${item?.name}_${i}`}
                    bsPrefix="menu-item"
                    onClick={item?.onClick}
                  >
                    {item?.name}
                  </Dropdown.Item>
                ),
            )}
        </Dropdown.Menu>
      </div>
    </Dropdown>
  );
};

const MultiFilterDropdown = ({
  title,
  resetFilter,
  items,
  filtersSelected,
}: MultiFilterDropdownProps) => {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const selectedItems = useMemo(
    () => (items ? items.filter(item => item.isChecked) : []),
    [items],
  );
  const toggleTitle = useMemo(() => {
    if (selectedItems.length === 1) {
      return selectedItems[0].name;
    } else if (selectedItems.length) {
      return `${t('filters_selected')} ${filtersSelected}`;
    } else {
      return t('filter_nothing_selected');
    }
  }, [selectedItems]);

  useEffect(() => {
    !filtersSelected && resetFilter();
  }, [filtersSelected]);

  const removeFilter = e => {
    e.stopPropagation();
    resetFilter();
  };

  const onToggleHandler = (isOpen, e, metadata) => {
    if (metadata.source !== 'select') {
      setShow(isOpen);
    }
  };

  return (
    <Dropdown
      show={show}
      className="filter-dropdown"
      onToggle={(isOpen, e, metadata) => onToggleHandler(isOpen, e, metadata)}
    >
      <p className="filter-title">{title}</p>
      <div className="filter-block">
        <Dropdown.Toggle
          as="div"
          bsPrefix="filter-toggle"
          className={clsx(!show && filtersSelected && 'active')}
        >
          {toggleTitle}
          <span className="icon-wrp">
            <i className={clsx(`icon-${Config.name}-down`)} />
          </span>
          {!show && !!filtersSelected && (
            <span className="icon-wrp close-wrp" onClick={e => removeFilter(e)}>
              <i className={clsx(`icon-${Config.name}-plus`)} />
            </span>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu flip={false} bsPrefix="filter-menu">
          {items &&
            items
              ?.filter(item => item)
              .map((item, i) => (
                <div
                  key={`${item?.name}_${i}`}
                  className="filter-item-wrp"
                  onClick={item?.onClick}
                >
                  <Form.Check
                    custom
                    type="checkbox"
                    checked={item?.isChecked}
                    readOnly
                  />
                  <Dropdown.Item bsPrefix="menu-item">
                    {item?.name}
                  </Dropdown.Item>
                </div>
              ))}
        </Dropdown.Menu>
      </div>
    </Dropdown>
  );
};

const CasinoFilters = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const {
    casinoType,
    categories,
    setParams,
    activeCategory,
    orderBy,
    setOrderBy,
    setSearchData,
    games,
    providers,
    filters,
    setFilters,
  } = useCasinoConfig();
  const categoriesContainerRef = useRef<HTMLUListElement | null>(null);
  const [categoriesOverflow, setCategoriesOverflow] = useState(false);
  const params = useParams<{ category?: string; provider?: string }>();
  const history = useHistory();
  const location = useLocation();
  const lobbyPath = useRoutePath(PagesName.CasinoPage);
  const usedProviders = useMemo<Provider[]>(
    () =>
      games?.reduce((prev: any[], curr: any) => {
        const isIncluded = prev.some(
          provider => provider?.id === curr.provider?.id,
        );
        const providerItem = providers.find(
          provider => provider.id === curr.provider.id,
        );
        return isIncluded ? prev : [...prev, providerItem];
      }, []) || [],
    [games, providers],
  );
  const usedGenres = useMemo<string[]>(() => {
    const allGenres = games?.reduce(
      (prev: string[], curr: any) => [...prev, curr.genre],
      [],
    );
    return (
      allGenres?.filter(
        (item, index) => item && allGenres.indexOf(item) === index,
      ) || []
    );
  }, [games]);
  const usedThemes = useMemo<string[]>(() => {
    const allThemes = games?.reduce(
      (prev: string[], curr: any) => [...prev, curr.theme],
      [],
    );
    return (
      allThemes?.filter(
        (item, index) => item && allThemes.indexOf(item) === index,
      ) || []
    );
  }, [games]);

  useEffect(() => {
    setParams(params);
  }, []);

  useEffect(() => {
    checkCategoriesOverflow();
  }, [categories]);

  const checkCategoriesOverflow = () => {
    const el = categoriesContainerRef.current;
    if (el && el.offsetWidth + el.scrollLeft >= el.scrollWidth) {
      setCategoriesOverflow(false);
    } else {
      setCategoriesOverflow(true);
    }
  };

  const throttleOverflowHandler = throttle(checkCategoriesOverflow, 200);

  const linkToCategory = categoryData => {
    history.push(
      `/${casinoType}${categoryData ? `/${categoryData.slug}` : ''}`,
      { scrollPosition: window.scrollY },
    );
  };

  return (
    <>
      <StyledCasinoFilters>
        <div className="categories-wrp">
          <ul
            className="categories"
            ref={categoriesContainerRef}
            onScroll={throttleOverflowHandler}
          >
            <li
              className={clsx(
                'categories-item',
                location.pathname === lobbyPath && 'active',
              )}
              onClick={() => linkToCategory(null)}
            >
              <i className={clsx(`icon-${Config.name}-home`)} />
              {t('casino_lobby_category')}
            </li>
            {categories?.map(category => (
              <li
                key={`${category?.id}`}
                className={clsx(
                  'categories-item',
                  category.slug === activeCategory?.slug && 'active',
                )}
                onClick={() => linkToCategory(category)}
              >
                <i className={clsx(`icon-${Config.name}-${category.icon}`)} />
                {category.name}
              </li>
            ))}
            {[{ slug: 'new' }, { slug: 'featured' }].map(category => (
              <li
                key={category.slug}
                className={clsx(
                  'categories-item',
                  params.category === category.slug && 'active',
                )}
                onClick={() => linkToCategory(category)}
              >
                <i className={clsx(`icon-${Config.name}-${category.slug}`)} />
                {t(`${category.slug}_category`)}
              </li>
            ))}
            {user.logged_in && (
              <>
                <span className="categories-seperator"></span>
                <li
                  className={clsx(
                    'categories-item',
                    params.category === 'recent' && 'active',
                  )}
                  onClick={() => linkToCategory({ slug: 'recent' })}
                >
                  <i className={clsx(`icon-${Config.name}-recent`)} />
                  {t('casino_recent_category')}
                </li>
                <li
                  className={clsx(
                    'categories-item',
                    params.category === 'favourite' && 'active',
                  )}
                  onClick={() => linkToCategory({ slug: 'favourite' })}
                >
                  <i className={clsx(`icon-${Config.name}-favourite-off`)} />
                  {t('casino_favourite_category')}
                </li>
              </>
            )}
          </ul>
          {categoriesOverflow && (
            <i className={clsx(`icon-strive-right1`, 'scroll-more')}></i>
          )}
        </div>
        <div className="search-wrp">
          <Button
            variant="secondary"
            className="search-btn"
            onClick={() => setSearchData({ type: SearchActions.Show })}
          >
            <i className={clsx(`icon-${Config.name}-search`)}></i>
            <span className="title">{t('search_title')}</span>
          </Button>
          {location.pathname !== lobbyPath && (
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              className={clsx('filter-btn', showFilters && 'open')}
              onClick={() => setShowFilters(prevState => !prevState)}
            >
              <i
                className={clsx(
                  `icon-${Config.name}-${showFilters ? 'close' : 'filter'}`,
                )}
              ></i>
              <span className="title">{t('filter_title')}</span>
            </Button>
          )}
        </div>
      </StyledCasinoFilters>
      <StyledCasinoFiltersMenu className={clsx(showFilters && 'show')}>
        <MultiFilterDropdown
          title={t('provider_filter_title')}
          filtersSelected={
            usedProviders.filter(provider =>
              filters.providerFilterGroup.includes(provider),
            ).length
          }
          resetFilter={() => setFilters({ type: FilterActions.ResetProvider })}
          items={
            usedProviders?.map(provider => ({
              name: t(`provider_name_${provider.slug}`),
              isChecked: filters.providerFilterGroup.some(
                providerFilter => providerFilter.id === provider.id,
              ),
              onClick: () => {
                filters.providerFilterGroup.some(
                  providerFilter => providerFilter.id === provider.id,
                )
                  ? setFilters({
                      type: FilterActions.RemoveProvider,
                      payload: provider,
                    })
                  : setFilters({
                      type: FilterActions.AddProvider,
                      payload: provider,
                    });
              },
            })) || []
          }
        />
        <MultiFilterDropdown
          title={t('genre_filter_title')}
          filtersSelected={
            usedGenres.filter(genre => filters.genreFilterGroup.includes(genre))
              .length
          }
          resetFilter={() => setFilters({ type: FilterActions.ResetGenre })}
          items={
            usedGenres?.map(genre => ({
              name: t(`genre_name_${snakeCase(genre)}`),
              isChecked: filters.genreFilterGroup.some(
                genreFilter => genreFilter === genre,
              ),
              onClick: () => {
                filters.genreFilterGroup.some(
                  genreFilter => genreFilter === genre,
                )
                  ? setFilters({
                      type: FilterActions.RemoveGenre,
                      payload: genre,
                    })
                  : setFilters({
                      type: FilterActions.AddGenre,
                      payload: genre,
                    });
              },
            })) || []
          }
        />
        <MultiFilterDropdown
          title={t('theme_filter_title')}
          filtersSelected={
            usedThemes.filter(theme => filters.themeFilterGroup.includes(theme))
              .length
          }
          resetFilter={() => setFilters({ type: FilterActions.ResetTheme })}
          items={
            usedThemes?.map(theme => ({
              name: t(`theme_name_${snakeCase(theme)}`),
              isChecked: filters.themeFilterGroup.some(
                themeFilter => themeFilter === theme,
              ),
              onClick: () => {
                filters.themeFilterGroup.some(
                  themeFilter => themeFilter === theme,
                )
                  ? setFilters({
                      type: FilterActions.RemoveTheme,
                      payload: theme,
                    })
                  : setFilters({
                      type: FilterActions.AddTheme,
                      payload: theme,
                    });
              },
            })) || []
          }
        />
        <FilterDropdown
          title={t('order_by')}
          toggleTitle={
            orderBy?.type
              ? t(`order_type_${orderBy?.type}`)
              : t('filter_nothing_selected')
          }
          resetFilter={() => setOrderBy(null)}
          activeItemId={orderBy?.type}
          items={[
            {
              activeId: 'asc',
              name: t('order_by_AZ'),
              onClick: () => setOrderBy({ attr: 'name', type: 'asc' }),
            },
            {
              activeId: 'dsc',
              name: t('order_by_ZA'),
              onClick: () => setOrderBy({ attr: 'name', type: 'dsc' }),
            },
          ]}
        />
      </StyledCasinoFiltersMenu>
    </>
  );
};

export default CasinoFilters;
