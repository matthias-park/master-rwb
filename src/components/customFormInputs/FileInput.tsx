import React, { useState } from 'react';
import { Control, FieldValues, useFormContext } from 'react-hook-form';
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
  const { register, formState, watch } = useFormContext();
  return (
    <Form.Group>
      <Form.File
        {...register(id, rules)}
        disabled={disabled}
        isInvalid={!!formState[id]?.error}
        custom
        className={className}
        label={(!!watch(id) && filename) || title}
        data-browse={t('file_upload_browse')}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            setFilename(file.name);
          }
        }}
      />
    </Form.Group>
  );
};

export default FileInput;
