import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Carousel, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { FormField } from './OnlineForm';
import { PagesName, ThemeSettings } from '../../../../constants';
import { useHistory } from 'react-router-dom';
import { useRoutePath } from '../../../../hooks';

const MultiStepOnlineForm = ({
  fields,
  onSubmit,
  fieldChange,
  triggerRepeat,
  validationForms,
}) => {
  const { t, jsxT } = useI18n();
  const {
    watch,
    trigger,
    formState,
    register,
    handleSubmit,
  } = useFormContext();

  const history = useHistory();
  const loginRoute = useRoutePath(PagesName.LoginPage);

  const [activeItem, setActiveItem] = useState(0);
  const onLastSlide = activeItem === fields.length - 1;
  const onFirstSlide = activeItem === 0;

  const handleNext = () => {
    if (activeItem < fields.length - 1) {
      setActiveItem(activeItem + 1);
    }
  };

  const handlePrevious = () => {
    if (activeItem > 0) {
      setActiveItem(activeItem - 1);
    }
  };

  const steppedFormData = useMemo(() => {
    const currentFields = fields[activeItem]
      ?.flat?.()
      .map(section => {
        return section.fields.map(field => {
          return {
            required: field.required,
            id: field.id,
          };
        });
      })
      .flat();

    const requiredFieldsHaveValues = currentFields?.every(field => {
      return (field.required && !!watch(field.id)) || !field.required;
    });

    const currentFieldsValid = currentFields?.every(({ id }) => {
      return !formState.errors[id];
    });

    return {
      isValid: requiredFieldsHaveValues && currentFieldsValid,
      fields: currentFields?.map(f => f.id),
    };
  }, [activeItem, fields, watch()]);

  //@ts-ignore
  const { icons: icon } = ThemeSettings!;

  return (
    <div className="reg-form">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <>
          <div className="reg-form__header-wrp">
            {!onFirstSlide && (
              <i className={clsx(icon?.left)} onClick={handlePrevious}></i>
            )}
            <img
              className="reg-form__header-wrp__img"
              src="/assets/images/container-bg-img.png"
              alt="conainer-img"
            />
          </div>
          <div className="reg-form__footer-wrp">
            <Carousel
              wrap={false}
              indicators={true}
              controls={false}
              activeIndex={activeItem}
              onSelect={eventKey => {
                setActiveItem(eventKey);
              }}
              interval={null}
            >
              {fields.map(slide => (
                <Carousel.Item>
                  {slide.map(block => (
                    <div key={block?.title} className="reg-form__block">
                      <p
                        className={clsx(
                          'reg-form__block-title',
                          'mt-4',
                          !block?.description && 'mb-3',
                        )}
                      >
                        {!!block?.title && jsxT(`register_${block?.title}`)}
                      </p>
                      {!!block?.description && (
                        <p className="mb-3">
                          {jsxT(`register_${block?.description}`)}
                        </p>
                      )}
                      {block?.fields.map(field => {
                        if (!field) return null;
                        if (Array.isArray(field)) {
                          return (
                            <div className="grouped-inputs">
                              {field.map(innerField => {
                                return (
                                  <FormField
                                    key={innerField.id}
                                    field={innerField}
                                    validationForms={validationForms}
                                    triggerRepeat={triggerRepeat}
                                    fieldChange={fieldChange}
                                    registerField={register}
                                  />
                                );
                              })}
                            </div>
                          );
                        } else {
                          return (
                            <FormField
                              key={field.id}
                              field={field}
                              validationForms={validationForms}
                              triggerRepeat={triggerRepeat}
                              fieldChange={fieldChange}
                              registerField={register}
                            />
                          );
                        }
                      })}
                    </div>
                  ))}
                </Carousel.Item>
              ))}
            </Carousel>
            <LoadingButton
              onClick={async () => {
                if (!onLastSlide && steppedFormData.isValid) {
                  trigger(steppedFormData.fields);
                }
                if (steppedFormData.isValid) {
                  setTimeout(handleNext, 100);
                }
              }}
              type={onLastSlide ? 'submit' : 'button'}
              variant="primary w-100 rounded-pill mt-5 mb-3"
              disabled={!steppedFormData.isValid}
              loading={formState.isSubmitting}
            >
              {t(onLastSlide ? 'register_submit_btn' : 'register_continue_btn')}
            </LoadingButton>
            <div className="reg-form__footer-wrp__contact-us">
              <span className="reg-form__footer-wrp__contact-us__body">
                {t('login_contact_us_text')}
              </span>
              <span
                className="reg-form__footer-wrp__contact-us__btn"
                onClick={() => history.push(loginRoute)}
              >
                {t('login_contact_us_btn')}
              </span>
            </div>
            <div className="reg-form__footer-wrp__info">
              <img
                className="reg-form__footer-wrp__info__img"
                alt="responsible-gaming"
                src={`/assets/images/footer/responsible-gaming.png`}
              />
              <span className="reg-form__footer-wrp__info__text">
                {t('verification_info_text')}
              </span>
            </div>
          </div>
        </>
      </Form>
    </div>
  );
};

export default MultiStepOnlineForm;
