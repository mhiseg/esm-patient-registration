import React from 'react';
import styles from './phone.scss';
import { Input } from '../../input/basic-input/input/input.component';
import { useTranslation } from 'react-i18next';
import InputMask from "react-input-mask";

 export interface MaskedInput {
  mask: string;
  name: string;
  placeholder: string;
  setFieldValue(fieldName: string, value: string):void;
}

export const PhoneField: React.FC<MaskedInput> = (props) => {

  return (
    <InputMask
      className={styles.phoneInputStyle}
      {...props}
      onChange={(e) => {
        const value = e.target.value || "";
        const formatedValue = value
          .replace(/\)/g, "")
          .replace(/\(/g, "")
          .replace(/-/g, "")
          .replace(/ /g, "");
          props.setFieldValue(props.name,formatedValue);
        }}
    />
  );
};
