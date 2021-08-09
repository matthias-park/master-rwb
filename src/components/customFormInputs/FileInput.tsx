import React, { useState, useRef } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { useI18n } from '../../hooks/useI18n';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  rules?: any;
  disabled?: boolean;
  title?: string;
  className?: string;
}

const FileInput = ({ id, rules, disabled, className, title }: Props) => {
  const { t } = useI18n();
  const [filename, setFilename] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { field, fieldState } = useController({
    name: id,
    rules: rules,
    defaultValue: null,
  });

  function removeFile(e) {
    e.preventDefault();
    setFilename('');
    field.onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <Form.Group>
      <Form.File
        id={id}
        disabled={disabled}
        custom
        isInvalid={!!fieldState.error}
        className={className}
      >
        <Form.File.Input
          {...field}
          ref={fileInputRef}
          value={undefined}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              field.onChange(file);
              setFilename(file.name);
            }
          }}
        />
        <Form.File.Label
          data-browse={t('file_upload_browse')}
          className="d-flex"
        >
          <span className="custom-file__text">
            {(!!field.value && filename) || title}
          </span>
          {!!field.value && (
            <span className="custom-file__remove" onClick={e => removeFile(e)}>
              <i className="icon-close"></i>
            </span>
          )}
        </Form.File.Label>
      </Form.File>
    </Form.Group>
  );
};

export default FileInput;
