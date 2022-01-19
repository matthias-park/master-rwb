import React, { useState, useRef, useEffect } from 'react';
import CasinoSearch from './CasinoSearch';
import clsx from 'clsx';
import { useUIConfig } from '../../../../hooks/useUIConfig';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import useOnClickOutside from '../../../../hooks/useOnClickOutside';
import Button from 'react-bootstrap/Button';
import { ComponentName } from '../../../../constants';
import Link from '../../../../components/Link';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';
SwiperCore.use([Navigation]);

enum Filters {
  Categories = 1,
  Providers,
  FilterBy,
  OrderBy,
}

interface FilterDropdownProps {
  title: string;
  icon?: string;
  items: ({
    activeId: string | number;
    name: string;
    onClick?: any;
  } | null)[];
  show: boolean;
  expand: () => void;
  activeItemId?: string | number;
}

const FilterDropdown = ({
  title,
  icon,
  items,
  show,
  expand,
  activeItemId,
}: FilterDropdownProps) => {
  return (
    <ul className={clsx('filters-nav__dropdown', show && 'show')} key={title}>
      <span className="filters-nav__dropdown-title" onClick={expand}>
        <i className={clsx('mr-2', icon)}></i>
        {title}
        <i className="filters-nav__dropdown-title-arrow icon-down"></i>
      </span>
      <div className="filters-nav__dropdown-menu">
        {items
          ?.filter(item => item)
          .map(item => (
            <li
              className={clsx(
                'filters-nav__dropdown-menu-item',
                activeItemId && activeItemId === item?.activeId && 'active',
              )}
              onClick={item?.onClick}
            >
              {item?.name}
            </li>
          ))}
      </div>
    </ul>
  );
};

const CasinoFilters = () => {
  const { t } = useI18n();
  const [filterExpanded, setFilterExpanded] = useState<Filters | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarContainerRef = useRef<HTMLDivElement | null>(null);
  const isDesktopWidth = useDesktopWidth(991);
  const { backdrop } = useUIConfig();
  const {
    categories,
    providers,
    setParams,
    activeCategory,
    activeProvider,
    setCategoryFilter,
    setProviderFilter,
    categoryFilter,
    providerFilter,
    casinoType,
    orderBy,
    setOrderBy,
  } = useCasinoConfig();
  const location = useLocation();
  const history = useHistory();
  const params = useParams<{ category?: string; provider?: string }>();

  useEffect(() => {
    setParams(params);
  }, []);

  useEffect(() => {
    if (activeCategory) {
      activeCategory && setFilterExpanded(Filters.Categories);
    } else if (activeProvider) {
      activeProvider && setFilterExpanded(Filters.Providers);
    } else {
      setFilterExpanded(null);
    }
  }, [activeCategory, activeProvider]);

  useEffect(() => {
    backdrop.toggle(false);
  }, [location]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    backdrop.toggle(!showSidebar, [ComponentName.RightSidebar]);
  };

  const resetFilters = () => {
    setCategoryFilter(null);
    setProviderFilter(null);
    setOrderBy(null);
    toggleSidebar();
  };

  useOnClickOutside(sidebarContainerRef, () => {
    if (showSidebar) {
      setTimeout(() => {
        backdrop.toggle(false);
        setShowSidebar(false);
      }, 100);
    }
  });

  return (
    <>
      <div className="casino-filters">
        <ul className="casino-filters__categories">
          {isDesktopWidth ? (
            <>
              <Swiper
                slidesPerView={'auto'}
                navigation={true}
                spaceBetween={40}
                observeParents={true}
                observer={true}
              >
                <SwiperSlide>
                  <Link to={`/${casinoType}`}>
                    <li
                      className={clsx(
                        'casino-filters__categories-item',
                        !activeCategory && !activeProvider && 'active',
                      )}
                    >
                      <i className="icon-casino-lobby" />
                      {t('casino_lobby_category')}
                    </li>
                  </Link>
                </SwiperSlide>
                {!!categories &&
                  categories.map(category => (
                    <SwiperSlide>
                      <Link to={`/${casinoType}/${category.slug}`}>
                        <li
                          className={clsx(
                            'casino-filters__categories-item',
                            category.slug ===
                              (categoryFilter?.slug || activeCategory?.slug) &&
                              'active',
                          )}
                        >
                          <i className={clsx(`icon-${category.icon}`)} />
                          {category.name}
                        </li>
                      </Link>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </>
          ) : (
            <>
              <Link to={`/${casinoType}`}>
                <li
                  className={clsx(
                    'casino-filters__categories-item',
                    !activeCategory && !activeProvider && 'active',
                  )}
                >
                  <i className="icon-casino-lobby" />
                  {t('casino_lobby_category')}
                </li>
              </Link>
              {!!categories &&
                categories.map(category => (
                  <Link to={`/${casinoType}/${category.slug}`}>
                    <li
                      className={clsx(
                        'casino-filters__categories-item',
                        category.slug ===
                          (categoryFilter?.slug || activeCategory?.slug) &&
                          'active',
                      )}
                    >
                      <i className={clsx(`icon-${category.icon}`)} />
                      {category.name}
                    </li>
                  </Link>
                ))}
            </>
          )}
        </ul>
        <div className="casino-filters__search-wrp">
          <span className="casino-filter" onClick={toggleSidebar}>
            <i className="icon-filters icon-round-bg"></i>
          </span>
          <CasinoSearch />
        </div>
        <div
          className={clsx(
            'filters-sidebar',
            showSidebar && 'show',
            backdrop.ignoredComponents.includes(ComponentName.RightSidebar) &&
              'on-top',
          )}
          ref={sidebarContainerRef}
        >
          <div className="filters-sidebar__header">
            <h5 className="filters-sidebar__header-title">Filter Games</h5>
            <i
              className="filters-sidebar__header-close icon-close"
              onClick={toggleSidebar}
            ></i>
          </div>
          <div className="filters-sidebar__content">
            <p className="mb-5">Search Filter Options</p>
            <div className="filters-nav">
              <FilterDropdown
                title={
                  categoryFilter
                    ? categoryFilter.name
                    : activeCategory
                    ? activeCategory.name
                    : t('category_filter_title')
                }
                icon="icon-categories"
                show={filterExpanded === Filters.Categories}
                expand={() =>
                  setFilterExpanded(
                    filterExpanded === Filters.Categories
                      ? null
                      : Filters.Categories,
                  )
                }
                activeItemId={categoryFilter?.id || activeCategory?.slug}
                items={categories?.map(category => ({
                  activeId: categoryFilter ? category.id : category.slug,
                  name: category.name,
                  onClick: () =>
                    !activeCategory && !activeProvider
                      ? history.push(
                          `/${
                            casinoType === 'casino' ? 'casino' : 'live-casino'
                          }/${category.slug}`,
                        )
                      : setCategoryFilter(category),
                }))}
              />
              {casinoType === 'casino' && (
                <FilterDropdown
                  title={
                    providerFilter
                      ? t(`provider_name_${providerFilter.slug}`)
                      : activeProvider
                      ? t(`provider_name_${activeProvider.slug}`)
                      : t('provider_filter_title')
                  }
                  icon="icon-providers"
                  show={filterExpanded === Filters.Providers}
                  expand={() =>
                    setFilterExpanded(
                      filterExpanded === Filters.Providers
                        ? null
                        : Filters.Providers,
                    )
                  }
                  activeItemId={
                    providerFilter?.id || activeProvider?.slug || 'all'
                  }
                  items={[
                    activeCategory && {
                      activeId: 'all',
                      name: t('all_providers'),
                      onClick: () => setProviderFilter(null),
                    },
                    ...(providers?.map(provider => ({
                      activeId: providerFilter ? provider.id : provider.slug,
                      name: t(`provider_name_${provider.slug}`),
                      onClick: () =>
                        !activeCategory && !activeProvider
                          ? history.push(`/casino/providers/${provider.slug}`)
                          : setProviderFilter(provider),
                    })) || []),
                  ].filter(Boolean)}
                />
              )}
              {(activeProvider || activeCategory) && (
                <FilterDropdown
                  title={t('order_by')}
                  icon="icon-order-sort"
                  show={filterExpanded === Filters.OrderBy}
                  expand={() =>
                    setFilterExpanded(
                      filterExpanded === Filters.OrderBy
                        ? null
                        : Filters.OrderBy,
                    )
                  }
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
              )}
            </div>
            <Button
              variant="tertiary"
              size="sm"
              className="mx-auto rounded-pill mt-2 px-4"
              onClick={resetFilters}
            >
              {t('filter_reset')}
            </Button>
          </div>
        </div>
      </div>
      <hr className="divider-secondary d-none d-lg-block mx-n1 mx-xl-n4 mb-0" />
    </>
  );
};

export default CasinoFilters;
