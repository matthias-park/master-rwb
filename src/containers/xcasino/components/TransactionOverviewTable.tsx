import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import useApi from '../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';

const TransactionOverviewTable = () => {
  const [show, setShow] = useState(false);
  const { data, error } = useApi('/railsapi/v1/user/session_details');
  const isDataLoading = !data && !error;

  return (
    <>
      <h6 className="overview-table__title" onClick={() => setShow(!show)}>
        Changes Since Last Login
      </h6>
      <Table>
        <thead>
          <tr>
            <th>Current Balance</th>
            <th>Initial Balance</th>
            <th>Total Losses</th>
            <th>Total Profits</th>
            <th>Total Stake</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {isDataLoading ? (
              <div className="mobile-td-wrp">
                <span className="mobile-th">Loading Overview</span>
                <td colSpan={5} className="overview-table__loading-row">
                  <Spinner animation="border" size="sm" />
                </td>
              </div>
            ) : (
              <>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">Current Balance</span>
                  <td>{data.Data.CurrentBalance}</td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">Initial Balance</span>
                  <td>{data.Data.InitialBalance}</td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">Total Losses</span>
                  <td>{data.Data.TotalLosses}</td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">Total Profits</span>
                  <td>{data.Data.TotalProfits}</td>
                </div>
                <div className="mobile-td-wrp">
                  <span className="mobile-th">Total Stake</span>
                  <td>{data.Data.TotalStake}</td>
                </div>
              </>
            )}
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default TransactionOverviewTable;
