import React, { useState, useRef, useEffect, useMemo } from 'react';
import { snakeCase } from '../../../../utils/reactUtils';
import clsx from 'clsx';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import Button from 'react-bootstrap/Button';
import { useHistory, useParams } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import { useAuth } from '../../../../hooks/useAuth';
import {
  StyledCasinoFilters,
  StyledCasinoFiltersMenu,
} from '../styled/casinoStyles';
import { Config } from '../../../../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { Provider } from '../../../../types/api/Casino';

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

  const removeFilter = e => {
    e.stopPropagation();
    resetFilter();
  };

  const onToggleHandler = (isOpen, e, metadata) => {
    if (metadata.source != 'select') {
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
          {filtersSelected
            ? `${t('filters_selected')} ${filtersSelected}`
            : t('filter_nothing_selected')}
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
    activeProvider,
    orderBy,
    setOrderBy,
    searchData,
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
  const isFavouriteCategory = params.category === 'favourite';
  const isRecentCategory = params.category === 'recent';
  const usedProviders = useMemo<Provider[]>(
    () =>
      games?.reduce((prev: any[], curr: any) => {
        const isIncluded = prev.some(
          provider => provider.id === curr.provider.id,
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
    checkCategoriesOverflow(categoriesContainerRef.current);
  }, [categoriesContainerRef]);

  const checkCategoriesOverflow = el => {
    if (el.offsetWidth + el.scrollLeft >= el.scrollWidth) {
      setCategoriesOverflow(false);
    } else {
      setCategoriesOverflow(true);
    }
  };

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
            onScroll={e => checkCategoriesOverflow(e.target)}
          >
            <li
              className={clsx(
                'categories-item',
                !activeCategory &&
                  !activeProvider &&
                  !isFavouriteCategory &&
                  !isRecentCategory &&
                  'active',
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
            {user.logged_in && (
              <>
                <span className="categories-seperator"></span>
                <li
                  className={clsx(
                    'categories-item',
                    isRecentCategory && 'active',
                  )}
                  onClick={() => linkToCategory({ slug: 'recent' })}
                >
                  <i className={clsx(`icon-${Config.name}-recent`)} />
                  {t('casino_recent_category')}
                </li>
                <li
                  className={clsx(
                    'categories-item',
                    isFavouriteCategory && 'active',
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
            onClick={() => setSearchData({ ...searchData, showSearch: true })}
          >
            <i className={clsx(`icon-${Config.name}-search`)}></i>
            <span className="title">{t('search_title')}</span>
          </Button>
          {activeCategory && (
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
          filtersSelected={filters.providerFilterGroup.length}
          resetFilter={() =>
            setFilters(prev => ({ ...prev, providerFilterGroup: [] }))
          }
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
                  ? setFilters(prev => ({
                      ...prev,
                      providerFilterGroup: prev.providerFilterGroup.filter(
                        providerFilter => providerFilter.id !== provider.id,
                      ),
                    }))
                  : setFilters(prev => ({
                      ...prev,
                      providerFilterGroup: [
                        ...prev.providerFilterGroup,
                        provider,
                      ],
                    }));
              },
            })) || []
          }
        />
        <MultiFilterDropdown
          title={t('genre_filter_title')}
          filtersSelected={filters.genreFilterGroup.length}
          resetFilter={() =>
            setFilters(prev => ({ ...prev, genreFilterGroup: [] }))
          }
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
                  ? setFilters(prev => ({
                      ...prev,
                      genreFilterGroup: prev.genreFilterGroup.filter(
                        genreFilter => genreFilter !== genre,
                      ),
                    }))
                  : setFilters(prev => ({
                      ...prev,
                      genreFilterGroup: [...prev.genreFilterGroup, genre],
                    }));
              },
            })) || []
          }
        />
        <MultiFilterDropdown
          title={t('theme_filter_title')}
          filtersSelected={filters.themeFilterGroup.length}
          resetFilter={() =>
            setFilters(prev => ({ ...prev, themeFilterGroup: [] }))
          }
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
                  ? setFilters(prev => ({
                      ...prev,
                      themeFilterGroup: prev.themeFilterGroup.filter(
                        themeFilter => themeFilter !== theme,
                      ),
                    }))
                  : setFilters(prev => ({
                      ...prev,
                      themeFilterGroup: [...prev.themeFilterGroup, theme],
                    }));
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
