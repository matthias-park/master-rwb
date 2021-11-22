import React, { useState, useMemo, useEffect, forwardRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import { Button } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { useI18n } from '../../../../hooks/useI18n';

const DateFilterInput = forwardRef(
  (
    { label, value, ...props }: { label: string; value: string },
    ref: any,
  ): any => (
    <div className="transactions-page__date-filter-input">
      <label htmlFor={label}>{label}</label>
      <input
        {...props}
        ref={ref}
        type="text"
        id={label}
        value={value}
        readOnly
      />
      <i className="icon-calendar"></i>
    </div>
  ),
);

const DateFilter = ({
  title,
  dateTo,
  dateFrom,
  updateUrl,
}: {
  title?: string;
  dateTo: Dayjs;
  dateFrom: Dayjs;
  updateUrl: (dateFrom: Dayjs, dateTo: Dayjs) => void;
}) => {
  const { t } = useI18n();
  const [newDateFrom, setNewDateFrom] = useState<Dayjs>(dateFrom);
  const [newDateTo, setNewDateTo] = useState<Dayjs>(dateTo);
  const [isOpen, setIsOpen] = useState<string>('');
  const validDate = newDateTo.diff(newDateFrom, 'd') >= 0;

  useEffect(() => {
    setNewDateFrom(dateFrom);
    setNewDateTo(dateTo);
  }, [dateFrom.format('DD/MM/YYYY'), dateTo.format('DD/MM/YYYY')]);

  const disabledSearchBtn = useMemo(() => {
    const formatDate = date => date.format('DD/MM/YYYY');
    return (
      !validDate ||
      (formatDate(dateFrom) === formatDate(newDateFrom) &&
        formatDate(dateTo) === formatDate(newDateTo))
    );
  }, [validDate, dateFrom, newDateFrom, dateTo, newDateTo]);

  return (
    <>
      <h6 className="mb-6">{title}</h6>
      <div className="transactions-page__date-filter">
        <DatePicker
          customInput={
            <DateFilterInput
              label="Date From"
              value={dayjs(newDateFrom.toDate()).format('YYYY-MM-DD')}
            />
          }
          selected={newDateFrom.toDate()}
          onChange={date => {
            setIsOpen('');
            setNewDateFrom(dayjs(date as Date));
          }}
          dateFormat="yyyy-MM-dd"
          maxDate={dateTo.toDate()}
        />
        <DatePicker
          customInput={
            <DateFilterInput
              label="Date To"
              value={dayjs(newDateTo.toDate()).format('YYYY-MM-DD')}
            />
          }
          selected={newDateTo.toDate()}
          onChange={date => {
            setIsOpen('');
            setNewDateTo(dayjs(date as Date));
          }}
          dateFormat="yyyy-MM-dd"
          maxDate={dayjs().toDate()}
        />
        <Button
          className="rounded-pill"
          disabled={disabledSearchBtn}
          onClick={() => {
            updateUrl(newDateFrom, newDateTo);
          }}
        >
          Show Results
        </Button>
      </div>
    </>
  );
};

export default DateFilter;
