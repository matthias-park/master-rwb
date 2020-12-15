import React from 'react';
import { Link } from 'react-router-dom';
// import useSWR from 'swr';
// import { getApi } from '../../utils/apiUtils';
import { PROMOTION_LIST } from '../../constants';
import PromotionListItem from '../../types/PromotionListItem';

const PromoItem = ({ item }) => (
  <div className="promo-item  col-sm-6 pb-3">
    <div className="card">
      <Link className="promo-img" to={item.link}>
        <img className="card-img-top" alt="img" src={item.img} />
      </Link>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start flex-grow-1 flex-md-grow-0 pt-3">
        <div className="card-body pt-0">
          <h5 className="card-title font-weight-bold mb-0 pb-1">
            {item.title}
          </h5>
          <p className="card-text"></p>
        </div>
        <div className="card-footer p-0 pl-md-3"></div>
      </div>
    </div>
  </div>
);

const PromotionsPage = () => {
  // const { data } = useSWR('/api/promotions', getApi, {
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  // });
  const data: PromotionListItem[] = PROMOTION_LIST;
  return (
    <div
      className="d-flex flex-xl-nowrap justify-content-center px-2 px-xl-0"
      id=" "
    >
      <div className="p-md-3 py-3 scrollable w-100">
        <div className="container promotions-inner">
          <h1 className="promo-title mb-3">Ongoing Promotions</h1>

          <ul
            className="nav nav-tabs flex-nowrap justify-content-start"
            id="myTab"
            role="tablist"
          >
            <li className="nav-item pr-2 pr-md-2">
              <a
                className="nav-link px-0 active"
                id="promo-all-tab"
                data-toggle="tab"
                href="#promo-all"
                role="tab"
                aria-controls="promo-all"
                aria-selected="true"
              >
                All <span>(5)</span>
              </a>
            </li>
          </ul>

          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade active show"
              id="promo-all"
              role="tabpanel"
              aria-labelledby="promo-all-tab"
            >
              <div className="promotion-cards container px-0">
                <div className="row">
                  {data &&
                    data.map(item => <PromoItem key={item.link} item={item} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
