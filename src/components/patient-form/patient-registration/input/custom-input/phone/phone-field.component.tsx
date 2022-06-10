import React, { useContext, useEffect, useState } from 'react';
import styles from '../field.scss';
import formatPhoneNumber from './normlizePhoneNumber';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'carbon-components-react';
import { useField } from 'formik';


interface InputProps {
  id: string;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  prefix?: string;
  className?: string;
  value?: string;
}

export const PhoneInput: React.FC<InputProps> = (props) => {
  const [field, meta, helpers] = useField(props.name);
  const { value } = meta;
  const { setValue,setError } = helpers;
  const [patternText, setPatternText] = useState(null)
  const [patternState, setPatternState] = useState(null)
    
  const handleChange = (e, value) => {
    e.target.value = formatPhoneNumber(value.substring(6));
    setValue(e.target.value)
  }

  return (
    <div>
      <TextInput
        type="tel"
        labelText={''}
        {...props}
        {...field}
        invalid={!!(meta.touched && meta.error)}
        invalidText={meta.error}
        onChange={(e) => {
          const { value } = e.target;
          handleChange(e, value)
        }}
        light={true}
        value={props.prefix + " "+formatPhoneNumber(field.value)}
      />
    </div>
  );
};
