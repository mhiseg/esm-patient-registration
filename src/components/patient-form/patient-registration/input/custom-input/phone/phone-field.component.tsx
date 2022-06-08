import React, { useEffect, useState } from 'react';
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
}

export const PhoneInput: React.FC<InputProps> = (props) => {
  const [field, meta, helpers] = useField(props.name);
  const { value } = meta;
  const { setValue } = helpers;
  const [patternText, setPatternText] = useState(null)
  const [patternState, setPatternState] = useState(null)
  const { t } = useTranslation();
  
  const handleChange = (e, value) => {
    console.log(value,'=================',e.target.value);
    e.target.value = formatPhoneNumber(value.substring((props.prefix.length+1)));
    const number = props.prefix.replace(/\D/g, "") + e.target.value.replace(/-/g, "")
    setValue(props.prefix + " " + e.target.value)
  }

  const handleError = () => {
    if (value.length > (props.prefix.length+1) && value.length < props.prefix.length + 10 ) {
      setPatternState(true);
      setPatternText(t('Format de telephone non valide'));
    } else {
      if (value.length == props.prefix.length)
        setValue(undefined);
      setPatternState(false);
      setPatternText(null);
    }
  }

  return (
    <div>
      <TextInput
        type="tel"
        labelText={''}
        {...props}
        {...field}
        invalid={patternState}
        invalidText={patternText}
        onChange={(e) => {
          const { value } = e.target;
          handleChange(e, value)
        }}
        light={true}
        onBlur={handleError}
        required={props.required}
        value={value}
      />
    </div>
  );
};
