import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Carousel, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { FormField } from './OnlineForm';
import { ThemeSettings } from '../../../../constants';

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
  const { icons: icon } = ThemeSettings!;
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

  return (
    <div className="reg-form">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <>
          <div className="reg-form__header-wrp">
            {!onFirstSlide && (
              <i className={clsx(icon?.left)} onClick={handlePrevious}></i>
            )}
            <div>
              <h1 className="reg-form__title">{jsxT('register_title')}</h1>
              <p className="reg-form__sub-title">{jsxT('register_desc')}</p>
            </div>
          </div>
          <span>
            <Carousel
              wrap={false}
              indicators={true}
              controls={false}
              activeIndex={activeItem}
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
              variant="primary w-100 rounded-pill"
              disabled={!steppedFormData.isValid}
              loading={formState.isSubmitting}
            >
              {t(onLastSlide ? 'register_submit_btn' : 'register_continue_btn')}
            </LoadingButton>
          </span>
        </>
      </Form>
    </div>
  );
};

export default MultiStepOnlineForm;
