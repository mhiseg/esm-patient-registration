import React, { useState } from 'react';
import styles from '../field.scss';
import formatPhoneNumber from './normlizePhoneNumber';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'carbon-components-react';

interface InputProps {
  id: string;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  setPhoneValue(fieldName: string, value: string): void;
}


export const PhoneField: React.FC<InputProps> = props => {
  const prefix = '+(509)';
  const [val, setVal] = useState(prefix)
  const [patternText,setPatternText]= useState(null)
  const [patternState,setPatternState]= useState(null)
  const [required,setRequired]= useState(false)



  const handleChange = (e,value) => {
    e.target.value = formatPhoneNumber(value.substring(6));
    const number = prefix.replace(/\D/g, "") + e.target.value.replace(/-/g, "")
    setVal(prefix + e.target.value)
    props.setPhoneValue(props.name, number);
  }

  const handleError = () => {
    if (val.length > 6 && val.length < prefix.length + 9){
      setPatternState(true);
      setPatternText('Format de telephone non valide');
      setRequired(true);
    }
  }

  return (
    <div>
      <TextInput
        type="tel"
        labelText={''}
        {...props}
        value={val}
        light={true}
        invalid={patternState}
        invalidText={patternText}
        onChange={(e) => {
          const { value } = e.target;
          handleChange(e,value)
        }}
         onBlur={handleError}
         required= {required}
      />
    </div>
  );
};