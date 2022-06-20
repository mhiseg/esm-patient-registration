import React from 'react';
import TextInput from 'carbon-components-react/es/components/TextInput';
import { useField } from 'formik';
import styles from "../../../input/input.scss";
import { useTranslation } from 'react-i18next';

interface InputProps {
  id: string;
  name: string;
  labelText: string;
  light: boolean;
  disabled?: boolean;
  placeholder?: string;
  hideLabel?: boolean;
  className?: string;
  value?:string;
  hidden?: boolean;
}

export const Input: React.FC<InputProps> = props => {
  const [field, meta] = useField(props.name);
  const { t } = useTranslation();
  return (
    <div>
      <TextInput
        {...props}
        {...field}
        invalid={!!(meta.touched && meta.error)}
        invalidText={meta.error}
        value={field.value || props.value || ''}
        size="lg"
      />
    </div>
  );
};
