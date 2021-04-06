import React from 'react';
import CustomAlert from '../../components/CustomAlert';
import { useI18n } from '../../hooks/useI18n';

const RegError = ({
  errMsg,
  onClose,
}: {
  errMsg: string;
  onClose: (msg: string | null) => void;
}) => {
  const { t, jsxT } = useI18n();

  return (
    <>
      <p
        className="d-flex align-items-center text-14 text-bold mb-3 cursor-pointer"
        onClick={() => onClose(null)}
      >
        <i className="icon-left h4 mb-1 ml-n2"></i>
        <u>
          <b>{t('registration_back')}</b>
        </u>
      </p>
      <CustomAlert show={true} variant="danger" className="mb-3">
        {t('register_page_submit_error')}
      </CustomAlert>
      <p>{jsxT('reg_error_info')}</p>
      <p className="mt-4">
        <b>{t('reg_error_reasons')}</b>
      </p>
      <ul className="pt-2 pl-4">
        <li className="mb-2">{errMsg}</li>
      </ul>
      <div className="info-block mt-4">
        <h4 className="info-block__title">{t('reg_error_info_block_title')}</h4>
        <p className="info-block__text">{jsxT('reg_error_info_block_text')}</p>
      </div>
    </>
  );
};

export default RegError;