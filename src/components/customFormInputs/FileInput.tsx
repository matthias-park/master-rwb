import React, { useState } from 'react';
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
  const { field, fieldState } = useController({
    name: id,
    rules: rules,
    defaultValue: null,
  });

  function removeFile() {
    setFilename('');
    field.onChange(null);
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
          value={undefined}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              field.onChange(file);
              setFilename(file.name);
            }
          }}
        />
        <Form.File.Label data-browse={t('file_upload_browse')}>
          {(!!field.value && filename) || title}
        </Form.File.Label>
        {!!field.value && (
          <span className="custom-file__remove" onClick={removeFile}>
            <i className="icon-close"></i>
          </span>
        )}
      </Form.File>
    </Form.Group>
  );
};

export default FileInput;
