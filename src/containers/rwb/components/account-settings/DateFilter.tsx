import React, { useState, useMemo, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import { Button } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { useI18n } from '../../../../hooks/useI18n';
import clsx from 'clsx';
import { franchiseDateFormat } from '../../../../constants';

const periods = [7, 14, 30];
const PeriodFilter = ({ dateTo, dateFrom, updateUrl }) => {
  const { t } = useI18n();
  const dateToToday = useMemo(() => dayjs().isSame(dateTo, 'day'), [dateTo]);
  const dateFromPeriod = useMemo(
    () =>
      periods.find(period =>
        dayjs().subtract(period, 'day').isSame(dateFrom, 'day'),
      ),
    [dateFrom],
  );

  const updatePeriod = period =>
    updateUrl(dayjs().subtract(period, 'day'), dayjs());

  return (
    <div className="account-tabs mb-sm-3">
      {periods.map(period => {
        return (
          <button
            key={period}
            className={clsx(
              'account-tabs__tab',
              dateFromPeriod === period && !!dateToToday && 'active',
            )}
            onClick={() => updatePeriod(period)}
          >
            {period} {t('days')}
          </button>
        );
      })}
    </div>
  );
};

const DatepickerInput = ({ ...props }) => (
  <input type="text" {...props} readOnly />
);

const DateFilter = ({
  dateTo,
  dateFrom,
  updateUrl,
  className,
  withPeriods,
}: {
  dateTo: Dayjs;
  dateFrom: Dayjs;
  updateUrl: (dateFrom: Dayjs, dateTo: Dayjs) => void;
  className?: string;
  withPeriods?: boolean;
}) => {
  const { t } = useI18n();
  const [newDateFrom, setNewDateFrom] = useState<Dayjs>(dateFrom);
  const [newDateTo, setNewDateTo] = useState<Dayjs>(dateTo);
  const validDate = newDateTo.diff(newDateFrom, 'd') >= 0;

  useEffect(() => {
    setNewDateFrom(dateFrom);
    setNewDateTo(dateTo);
  }, [
    dateFrom.format(franchiseDateFormat),
    dateTo.format(franchiseDateFormat),
  ]);

  const disabledSearchBtn = useMemo(() => {
    const formatDate = date => date.format(franchiseDateFormat);
    return (
      !validDate ||
      (formatDate(dateFrom) === formatDate(newDateFrom) &&
        formatDate(dateTo) === formatDate(newDateTo))
    );
  }, [validDate, dateFrom, newDateFrom, dateTo, newDateTo]);

  return (
    <div className={clsx('date-filter', className)}>
      <div className="date-filter__picker-wrp mb-sm-3">
        <DatePicker
          popperPlacement="bottom-start"
          selected={newDateFrom.toDate()}
          onChange={date => {
            setNewDateFrom(dayjs(date as Date));
          }}
          dateFormat={franchiseDateFormat
            .toLocaleLowerCase()
            .replace('mm', 'MM')}
          maxDate={dateTo.toDate()}
          customInput={<DatepickerInput />}
        />
        <i
          className={clsx(
            `icon-${window.__config__.name}-calendar-m`,
            'date-filter__picker-wrp-icon',
          )}
        ></i>
      </div>
      <span className="text-gray-400 mx-auto mx-sm-1 mb-sm-3">-</span>
      <div className="date-filter__picker-wrp mb-sm-3">
        <DatePicker
          popperPlacement="bottom-start"
          minDate={newDateFrom.toDate()}
          selected={newDateTo.toDate()}
          onChange={date => {
            setNewDateTo(dayjs(date as Date));
          }}
          dateFormat={franchiseDateFormat
            .toLocaleLowerCase()
            .replace('mm', 'MM')}
          maxDate={dayjs().toDate()}
          customInput={<DatepickerInput />}
        />
        <i
          className={clsx(
            `icon-${window.__config__.name}-calendar-m`,
            'date-filter__picker-wrp-icon',
          )}
        ></i>
      </div>
      <Button
        className="mt-3 mt-sm-0 ml-sm-2 mr-auto mb-sm-3 btn--small-radius"
        variant="primary"
        disabled={disabledSearchBtn}
        onClick={() => {
          updateUrl(newDateFrom, newDateTo);
        }}
      >
        {t('search')}
      </Button>
      {withPeriods && (
        <PeriodFilter
          dateTo={dateTo}
          dateFrom={dateFrom}
          updateUrl={updateUrl}
        />
      )}
    </div>
  );
};

export default DateFilter;
