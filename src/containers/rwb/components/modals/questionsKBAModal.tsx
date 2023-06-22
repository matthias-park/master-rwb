import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import Button from 'react-bootstrap/esm/Button';
import { Form, Spinner } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import RadioInput from '../../../../components/customFormInputs/RadioInput';
import { getApi, postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useAuth } from '../../../../hooks/useAuth';
import { KYC_VALIDATOR_STATUS } from '../../../../types/UserStatus';

const QuestionsKBAModal = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { activeModal, disableModal, enableModal } = useModal();
  const hideModal = () => disableModal(ComponentName.QuestionsKBAModal);
  const formMethods = useForm<any>({
    mode: 'all',
  });
  const { handleSubmit } = formMethods;
  const [questions, setQuestions] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { updateUser } = useAuth();

  useEffect(() => {
    if (
      user.logged_in &&
      user.validator_status === KYC_VALIDATOR_STATUS.ShouldAnswerKBA
    ) {
      enableModal(ComponentName.QuestionsKBAModal);
    } else {
      disableModal(ComponentName.QuestionsKBAModal);
    }
  }, [user.validator_status]);

  useEffect(() => {
    if (activeModal === ComponentName.QuestionsKBAModal) {
      !questions.length && getQuestions();
    }
  }, [activeModal]);

  const getQuestions = async () => {
    setIsDataLoading(true);
    const resp = await getApi<RailsApiResponse<any>>(
      '/railsapi/v1/user/kba_questions',
    ).catch(err => err);
    if (resp.Success) {
      setQuestions(resp.Data.Questions);
    }
    setIsDataLoading(false);
  };

  const onSubmit = async data => {
    setIsDataLoading(true);
    const answers = Object.entries(data).map(([key, value]) => ({
      QuestionId: Number(key),
      SelectedAnswerId: Number(value),
    }));
    const resp = await postApi<RailsApiResponse<any>>(
      '/railsapi/v1/user/submit_kba_questions',
      {
        Answers: answers,
      },
    ).catch(err => err);
    if (resp.Success) {
      hideModal();
      updateUser();
    }
    setIsDataLoading(false);
  };

  return (
    <GenericModal
      isCentered
      show={activeModal === ComponentName.QuestionsKBAModal}
      hideCallback={() => hideModal()}
      className="mx-2 pb-5"
    >
      <div className="d-flex justify-content-center flex-column">
        <h2>{t('kba_verification_title')}</h2>
        <p>{t('kba_verification_subtext')}</p>
        {isDataLoading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" className="spinner-custom mx-auto" />
          </div>
        )}
        {!isDataLoading && (
          <FormProvider {...formMethods}>
            <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
              <div
                className="mb-3"
                style={{ maxHeight: '500px', overflowY: 'auto' }}
              >
                {questions.map((question: any) => (
                  <div className="mb-3">
                    <h5 className="mb-3">{question.Question}</h5>
                    {Object.entries(question.PossibleAnswers).map(
                      ([key, value]: [key: any, value: any]) => (
                        <>
                          <RadioInput
                            id={`answer_${key}`}
                            title={value}
                            group={question.QuestionId.toString()}
                            value={key}
                            className="mb-2"
                          />
                        </>
                      ),
                    )}
                  </div>
                ))}
              </div>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  onClick={hideModal}
                  className="w-100 mr-2"
                >
                  {t('kba_verification_skip')}
                </Button>
                <Button type="submit" className="w-100">
                  {t('kba_verification_submit')}
                </Button>
              </div>
            </Form>
          </FormProvider>
        )}
      </div>
    </GenericModal>
  );
};

export default QuestionsKBAModal;
