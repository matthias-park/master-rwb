import React, { useState, useMemo, useRef } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import {
  StyledBonusInputWrp,
  StyledBonusCard,
  StyledBonusCardList,
  StyledBonusInputContainer,
  StyledBonusTable,
} from '../components/styled/bonusesStyles';
import { FormProvider, useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import TextInput from '../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../components/LoadingButton';
import useApi from '../../../hooks/useApi';
import { useAuth } from '../../../hooks/useAuth';
import { postApi } from '../../../utils/apiUtils';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import CustomAlert from '../components/CustomAlert';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { franchiseDateFormat } from '../../../constants';
import clsx from 'clsx';
import Spinner from 'react-bootstrap/Spinner';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import Table from 'react-bootstrap/Table';
import useLocalStorage from '../../../hooks/useLocalStorage';
import DateFilter from '../components/account-settings/DateFilter';
import { sortAscending, setDateTime } from '../../../utils/index';

interface BonusCardProps {
  bonusData: {
    title: string;
    amount: string;
    validTo: string;
    rolloverUsed: number;
    rolloverAmount: number;
    engine: string;
    usageId: string;
    count?: number;
    canActivate: boolean;
    canCancel: boolean;
  };
  mutateBonuses: () => any;
  isActive: boolean;
}

interface BonusCardListProps {
  title: string;
  items: any[];
  mutate: () => any;
}

enum BonusStatus {
  Pending = 1,
  Received = 2,
  Cleared = 3,
  Expired = 4,
  Cancelled = 5,
  ToRollover = 6,
}

const BonusHistoryTable = ({ bonuses }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [dateTo, setDateTo] = useLocalStorage('bonuses-date-to', dayjs(), {
    valueAs: value => setDateTime(dayjs(value), 0, 0, 0),
  });
  const [dateFrom, setDateFrom] = useLocalStorage(
    'bonuses-date-from',
    dayjs().subtract(30, 'day'),
    {
      valueAs: value => setDateTime(dayjs(value), 0, 0, 0),
    },
  );
  const filteredData = useMemo(
    () =>
      bonuses.filter(bonus => {
        const bonusReceivedDate = setDateTime(dayjs(bonus.ReceivedAt), 0, 0, 0);
        return (
          dateFrom.diff(bonusReceivedDate, 'day') <= 0 &&
          dateTo.diff(bonusReceivedDate, 'day') >= 0
        );
      }),
    [bonuses, dateTo, dateFrom],
  );

  const updateDateValues = (newDateFrom, newDateTo) => {
    setDateFrom(newDateFrom);
    setDateTo(newDateTo);
  };

  return (
    <StyledBonusTable>
      <div className="info-container mb-3">
        <div className="info-container__info pt-3">
          <div className="d-flex align-items-center">
            <p className="info-container__title pr-3">
              <b>{t('bonuses_history')}</b>
            </p>
          </div>
        </div>
        <div className="info-container__text">
          <DateFilter
            dateTo={dateTo}
            dateFrom={dateFrom}
            updateUrl={updateDateValues}
            className="pt-2"
            withPeriods
          />
          {!filteredData ? (
            <div className="d-flex justify-content-center pt-4 pb-3">
              <Spinner animation="border" className="spinner-custom mx-auto" />
            </div>
          ) : !!filteredData && filteredData.length ? (
            <div className="table-container d-flex flex-column mb-2">
              <Table hover className="limits-history-table">
                <thead>
                  <tr>
                    <th>{t('_date')}</th>
                    <th>{t('name')}</th>
                    <th>{t('amount')}</th>
                    <th>{t('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                    .sort((a, b) =>
                      sortAscending(
                        dayjs(b.ReceivedAt).valueOf(),
                        dayjs(a.ReceivedAt).valueOf(),
                      ),
                    )
                    .map((bonus, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <strong className="heading-sm">{t('_date')}</strong>
                            {dayjs(new Date(bonus.ReceivedAt)).format(
                              franchiseDateFormat,
                            )}
                          </td>
                          <td>
                            <strong className="heading-sm">{t('name')}</strong>
                            {bonus.Name}
                          </td>
                          <td>
                            <strong className="heading-sm">
                              {t('amount')}
                            </strong>
                            <strong>
                              <NumberFormat
                                value={
                                  bonus.Amount ?? bonus.BonusCampaignAwardAmount
                                }
                                thousandSeparator
                                displayType={'text'}
                                prefix={user.currency}
                                decimalScale={2}
                                fixedDecimalScale={true}
                              />
                            </strong>
                          </td>
                          <td>
                            <strong className="heading-sm">
                              {t('status')}
                            </strong>
                            <div className="bonus-label-wrp">
                              <span
                                className={clsx(
                                  'bonus-label',
                                  bonus.BonusCampaignUsageStatus ===
                                    BonusStatus.Received && 'active',
                                )}
                              >
                                {t(
                                  `bonus_status_${bonus.BonusCampaignUsageStatus}`,
                                )}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          ) : (
            <h2 className="my-3 text-center">{t('limits_no_data')}</h2>
          )}
        </div>
      </div>
    </StyledBonusTable>
  );
};

const BonusCard = ({ bonusData, mutateBonuses, isActive }: BonusCardProps) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const {
    title,
    amount,
    validTo,
    rolloverUsed,
    rolloverAmount,
    engine,
    usageId,
    count,
    canActivate,
    canCancel,
  } = bonusData;
  const [showMenu, setShowMenu] = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const editMenuRef = useRef(null);

  useOnClickOutside(editMenuRef, () => setShowMenu(false));

  const cancelBonus = async e => {
    e.stopPropagation();
    setCancelLoading(true);
    const res = await postApi<RailsApiResponse<null>>(
      '/railsapi/v1/bonuses/cancel_bonus',
      {
        engine,
        usage_id: usageId,
      },
    );
    if (res.Success) {
      const updatedBonuses = await mutateBonuses();
      if (updatedBonuses) {
        setCancelLoading(false);
        setShowMenu(false);
      }
    }
  };

  const activateBonus = async () => {
    setActivateLoading(true);
    const res = await postApi<RailsApiResponse<null>>(
      '/railsapi/v1/bonuses/activate_bonus',
      {
        engine,
        usage_id: usageId,
      },
    );
    if (res.Success) {
      const updatedBonuses = await mutateBonuses();
      updatedBonuses && setActivateLoading(false);
    }
  };

  return (
    <StyledBonusCard>
      <div className="bonus-header">
        <span className="bonus-title">{title}</span>
        {canCancel && (
          <span
            className={clsx('edit', showMenu && 'active')}
            onClick={() => setShowMenu(!showMenu)}
            ref={editMenuRef}
          >
            <ul className={clsx('edit-menu', showMenu && 'show')}>
              <li onClick={cancelBonus}>
                {t('bonus_remove')}
                <LoadingSpinner
                  wrapperClassName={clsx(cancelLoading && 'ml-2')}
                  show={cancelLoading}
                  small
                />
              </li>
            </ul>
          </span>
        )}
      </div>
      <div className="valid-wrp">
        {!!validTo && (
          <div className="valid-date">
            <span>{t('bonus_valid_till')}</span>
            <span className="value">
              {dayjs(validTo).format(franchiseDateFormat)}
            </span>
          </div>
        )}
        <div className="valid-amount">
          <span>{t('bonus_amount')}</span>
          <span className="value">
            <NumberFormat
              value={amount}
              thousandSeparator
              displayType={'text'}
              prefix={user.currency}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </span>
        </div>
      </div>
      {!!rolloverAmount && (
        <>
          <div className="rollover-wrp">
            <span>{t('bonus_rollover_amount')}</span>
            <span className="value">
              <span>
                <NumberFormat
                  value={rolloverUsed}
                  thousandSeparator
                  displayType={'text'}
                  prefix={user.currency}
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </span>
              /
              <NumberFormat
                value={rolloverAmount}
                thousandSeparator
                displayType={'text'}
                prefix={user.currency}
                decimalScale={2}
                fixedDecimalScale={true}
              />
            </span>
          </div>
          <div className="rollover-bar">
            <div
              className="filled"
              style={{ width: `${(rolloverUsed / rolloverAmount) * 100}%` }}
            ></div>
          </div>
        </>
      )}
      {!isActive && canActivate && (
        <LoadingButton
          loading={activateLoading}
          variant="primary"
          type="submit"
          onClick={activateBonus}
        >
          {t('bonus_activate')}
        </LoadingButton>
      )}
    </StyledBonusCard>
  );
};

const BonusCardList = ({ title, items, mutate }: BonusCardListProps) => {
  return (
    <StyledBonusCardList className="fade-in">
      <h5 className="title">{title}</h5>
      <div className="list">
        {items?.map(bonus => (
          <BonusCard
            bonusData={{
              title: bonus.Name,
              validTo: bonus.ValidTo,
              amount: bonus.Amount ?? bonus.BonusCampaignAwardAmount,
              rolloverUsed: bonus.TotalRollover - bonus.RolloverAmountLeft,
              rolloverAmount: bonus.TotalRollover,
              engine: bonus.Engine,
              usageId: bonus.UsageId,
              count: bonus?.Count,
              canActivate: bonus.CanActivate,
              canCancel: bonus.CanCancel,
            }}
            mutateBonuses={mutate}
            isActive={bonus.IsActive}
          />
        ))}
      </div>
    </StyledBonusCardList>
  );
};

const BonusesPage = () => {
  const { t, jsxT } = useI18n();
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const { handleSubmit, formState } = formMethods;
  const { data, error, mutate } = useApi<any>('/railsapi/v1/bonuses/history');
  const isDataLoading = !data && !error;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const validBonuses = useMemo(
    () => data?.Data.filter(bonus => !bonus.IsVoided) || [],
    [data],
  );
  const voidedBonuses = useMemo(
    () => data?.Data.filter(bonus => bonus.IsVoided) || [],
    [data],
  );
  const activeBonuses = useMemo(
    () => validBonuses.filter(bonus => bonus.IsActive) || [],
    [data],
  );
  const queueBonuses = useMemo(
    () => validBonuses.filter(bonus => !bonus.IsActive) || [],
    [data],
  );

  const onSubmit = async ({ bonusCode }) => {
    const res = await postApi<RailsApiResponse<null>>(
      '/railsapi/v1/bonuses/apply_code',
      {
        code: bonusCode,
        code_source: 1,
      },
    );
    res &&
      setApiResponse({
        success: res.Success,
        msg: res.Message || t('request_bonus_apply_failed'),
      });
    if (res.Success) {
      mutate();
    }
  };

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title">{jsxT('bonuses_page_title')}</h1>

      <StyledBonusInputContainer>
        {apiResponse && (
          <CustomAlert
            show
            className="top-spacing-0"
            variant={apiResponse.success ? 'success' : 'danger'}
          >
            <div>{apiResponse?.msg}</div>
          </CustomAlert>
        )}
        <p className="mb-3">{t('bonus_input_text')}</p>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <StyledBonusInputWrp>
              <TextInput
                id="bonusCode"
                rules={{ required: true }}
                title="Bonus code"
                type="text"
              />
              <LoadingButton
                loading={!!formState.isSubmitting}
                variant="primary"
                type="submit"
              >
                {t('bonus_code_submit')}
              </LoadingButton>
            </StyledBonusInputWrp>
          </Form>
        </FormProvider>
      </StyledBonusInputContainer>
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      )}
      {!!data && (
        <>
          {!!activeBonuses.length && (
            <BonusCardList
              title={t('active_bonuses_title')}
              items={activeBonuses}
              mutate={mutate}
            />
          )}
          {!!queueBonuses.length && (
            <BonusCardList
              title={t('queue_bonuses_title')}
              items={queueBonuses}
              mutate={mutate}
            />
          )}
        </>
      )}
      {!!data && <BonusHistoryTable bonuses={voidedBonuses} />}
    </main>
  );
};

export default BonusesPage;
