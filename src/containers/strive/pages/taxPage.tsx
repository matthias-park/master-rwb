import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { postApi } from '../../../utils/apiUtils';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import dayjs from 'dayjs';
import { useAuth } from '../../../hooks/useAuth';
import { franchiseDateFormat } from '../../../constants';
import BalancesContainer from '../components/account-settings/BalancesContainer';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';

const TaxPage = () => {
  const { t, jsxT } = useI18n();
  const [data, setData] = useState<any>(null);
  const { user } = useAuth();
  const questionItems = useMemo(
    () => [
      {
        title: t('tax_question_1'),
        body: t('tax_answer_1'),
      },
      {
        title: t('tax_question_2'),
        body: t('tax_answer_2'),
      },
    ],
    [t],
  );

  const getTaxFile = async (bet_id, date) => {
    const response = await postApi<RailsApiResponse<any>>(
      '/restapi/v1/user/w9_file',
      {
        bet_id,
      },
    );
    if (response.Success) {
      const downloadLink = document.createElement('a');
      const file = `data:application/pdf;base64,${response.Data.files[0]}`;
      const fileName = `W2G_${user.id}_${dayjs(date).format(
        franchiseDateFormat,
      )}_${bet_id}_tax.pdf`;
      downloadLink.href = file;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  };

  const getTaxesData = async (page = 1) => {
    const response = await postApi<RailsApiResponse<any>>(
      '/restapi/v1/user/w2g_taxes_list',
      {
        page_number: page,
        page_size: 25,
      },
    );
    response.Success && setData(response.Data);
  };

  useEffect(() => {
    getTaxesData();
  }, []);

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title mb-3">{jsxT('tax_page_title')}</h1>
      <BalancesContainer />
      <div className="outer-info-block">
        <h3>
          <strong>{t('download_tax_form')}</strong>
        </h3>
        {!data ? (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="brand" className="mx-auto" />
          </div>
        ) : !!data && data.length ? (
          <div className="table-container d-flex flex-column mb-4">
            <Table>
              <thead>
                <tr>
                  <th>{t('_date')}</th>
                  <th>{t('bet_id')}</th>
                  <th>{t('win')}</th>
                  <th>{t('wager')}</th>
                  <th>{t('download')}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((tax, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <strong className="heading-sm">{t('_date')}</strong>
                        {dayjs(new Date(tax.DateWon)).format('YYYY-MM-DD')}
                      </td>
                      <td>
                        <strong className="heading-sm">{t('bet_id')}</strong>
                        {tax.BetId}
                      </td>
                      <td>
                        <strong className="heading-sm">{t('win')}</strong>
                        <span className="text-success">
                          {user.currency} {tax.WinAmount}
                        </span>
                      </td>
                      <td>
                        <strong className="heading-sm">{t('wager')}</strong>
                        {user.currency} {tax.BetAmount}
                      </td>
                      <td className="d-flex d-sm-table-cell align-items-center">
                        <strong className="heading-sm">{t('download')}</strong>
                        <span
                          onClick={() => getTaxFile(tax.BetId, tax.DateWon)}
                          className="d-inline-flex align-items-center justify-content-md-end cursor-pointer ml-md-3"
                        >
                          <i
                            className={`icon-${window.__config__.name}-download`}
                          ></i>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        ) : (
          <h2 className="mt-3 mb-5 text-center">{t('taxes_no_data')}</h2>
        )}
      </div>
      <QuestionsContainer items={questionItems} className="mt-5" />
      <HelpBlock
        title={'user_help_title'}
        blocks={['faq', 'phone', 'email']}
        className="d-block d-xl-none"
      />
    </main>
  );
};

export default TaxPage;
