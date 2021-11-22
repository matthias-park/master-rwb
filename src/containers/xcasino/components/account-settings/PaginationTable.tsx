import React, { useState, useEffect } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import { useI18n } from '../../../../hooks/useI18n';
import clsx from 'clsx';
import Spinner from 'react-bootstrap/Spinner';

const PaginationTable = ({ data, updateUrl, dateFrom, dateTo, totalPages }) => {
  const { t, jsxT } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const rangeOptions = [10, 25, 50];

  useEffect(() => {
    updateUrl(null, null, currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [dateTo.format('YYYY-MM-DD'), dateFrom.format('YYYY-MM-DD')]);

  return (
    <div className="pagination-table">
      {!data ? (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="brand" className="mx-auto" />
        </div>
      ) : data.length ? (
        <>
          <h6 className="mb-4">Showing Results</h6>
          <Table responsive hover>
            <thead>
              <tr>
                {data[0] &&
                  Object.keys(data[0]).map(key => <th key={key}>{t(key)}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={`transaction_row_${index}`}>
                  {Object.entries(item).map(([key, value]) => (
                    <div className="mobile-td-wrp" key={key}>
                      <span className="mobile-th">{t(key)}</span>
                      {/*
                      // @ts-ignore: Object is of type 'unknown'.*/}
                      <td>{value}</td>
                    </div>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="pagination-table__pagination">
            <Dropdown className="mr-3">
              <Dropdown.Toggle>Rows per page: 10</Dropdown.Toggle>
              <Dropdown.Menu></Dropdown.Menu>
            </Dropdown>
            <div className="pagination-table__pagination-icons">
              <i
                className={clsx(
                  'icon-previous2',
                  currentPage !== 1 && 'active',
                )}
                onClick={() => setCurrentPage(1)}
              ></i>
              <i
                className={clsx(
                  'icon-arrow-dropdown left',
                  currentPage !== 1 && 'active',
                )}
                onClick={() => setCurrentPage(prev => prev - 1)}
              ></i>
              <i
                className={clsx(
                  'icon-arrow-dropdown right',
                  currentPage !== totalPages && 'active',
                )}
                onClick={() => setCurrentPage(prev => prev + 1)}
              ></i>
              <i
                className={clsx(
                  'icon-next2',
                  currentPage !== totalPages && 'active',
                )}
                onClick={() => setCurrentPage(totalPages)}
              ></i>
            </div>
          </div>
        </>
      ) : (
        <h4 className="mb-5">{t('transactions_no_data')}</h4>
      )}
    </div>
  );
};

export default PaginationTable;
