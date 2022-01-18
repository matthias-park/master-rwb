import React, { useEffect, useState } from 'react';
import useApi from '../../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';
import { LimitRow } from '../../pages/limitsPage';
import { sortAscending } from '../../../../utils';
import { Modal } from 'react-bootstrap';
import { ComponentName } from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import Table from 'react-bootstrap/Table';
import GenericModalHeader from './GenericModalHeader';
import { useAuth } from '../../../../hooks/useAuth';
import { useI18n } from '../../../../hooks/useI18n';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import MaxBalanceTable from '../MaxBalanceTable';

const limitTypeOrder = ['Day', 'Week', 'Month'];
const LimitsModal = () => {
  const { t } = useI18n();
  const { user } = useAuth();

  const { data, mutate } = useApi<any>(
    user.logged_in && !user.registration_id
      ? '/restapi/v1/user/profile/play_limits'
      : null,
  );

  const [limitData, setLimitData] = useState(data);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [hasLimits, setHasLimits] = useState<boolean>(false);
  const [userCurrency, setUserCurrency] = useLocalStorage<
    string | undefined | null
  >('user-currency', null);
  const { activeModal, disableModal } = useModal();

  const closeModal = () => {
    disableModal(ComponentName.LimitsModal);
    if (!user.logged_in) {
      setLimitData(data);
      setIsDataLoading(true);
      setHasLimits(false);
    }
  };

  useEffect(() => {
    if (user.logged_in) {
      mutate();
      setUserCurrency(user.currency);
    }
  }, [user.logged_in]);

  useEffect(() => {
    if (!!data?.limits && user.logged_in) {
      setLimitData(data);
      setIsDataLoading(false);
    }
    data?.limits?.forEach(limit => {
      if (!!limit?.data?.length) {
        setHasLimits(true);
      }
    });
  }, [data]);

  return (
    <Modal
      show={activeModal === ComponentName.LimitsModal}
      onHide={closeModal}
      centered
      className="limits-modal"
    >
      <GenericModalHeader
        title={t('limits_modal_title')}
        hideTitleMobile
        handleClose={closeModal}
      />
      <h5 className="limits-modal__title">{t('limits_modal_title')}</h5>
      <Modal.Body>
        <div className="fade-in w-100 p-1">
          {!isDataLoading ? (
            <>
              <Table responsive className="mb-3">
                <thead>
                  <tr>
                    <th>{t('limits_table_type')}</th>
                    <th>{t('limits_table_time')}</th>
                    <th>{t('limits_table_remaining')}</th>
                    <th>{t('limits_table_valid_from')}</th>
                  </tr>
                </thead>
                <tbody>
                  {hasLimits ? (
                    limitData?.limits.map(limit => (
                      <>
                        {limit?.data
                          ?.sort((a, b) =>
                            sortAscending(
                              limitTypeOrder.indexOf(a.LimitType),
                              limitTypeOrder.indexOf(b.LimitType),
                            ),
                          )
                          .map(limitRowData => (
                            <LimitRow
                              limitType={limit.id}
                              limit={limitRowData}
                              currency={userCurrency}
                            />
                          ))}
                      </>
                    ))
                  ) : (
                    <tr>
                      <td>{t('limits_table_unset')}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <MaxBalanceTable currency={userCurrency} />
            </>
          ) : (
            <div className="d-flex h-100">
              <Spinner animation="border" variant="white" className="m-auto" />
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LimitsModal;
