import React, { useState } from 'react';
import { Control, FieldValues, useFormContext } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  rules?: any;
  disabled?: boolean;
  title?: string;
  className?: string;
}

const FileInput = ({ id, rules, disabled, className, title }: Props) => {
  const [filename, setFilename] = useState('');
  const { register, formState } = useFormContext();

  return (
    <Form.Group>
      <Form.File
        {...register(id, rules)}
        disabled={disabled}
        isInvalid={!!formState[id]?.error}
        custom
        className={className}
        label={filename || title}
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
