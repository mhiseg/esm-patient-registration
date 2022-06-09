import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../input/basic-input/input/input.component';
import styles from '../field.scss';


interface GivenNameFieldProps{
  name: string;
  className?: string;
  required?: boolean;
}

export const GivenNameField:React.FC<GivenNameFieldProps> = ({name, className,required}) => {
  const { t } = useTranslation();
  let star = "";
  required == true ? star ="*":star="";
  return(
    <>
      <Input
        className={className}
        id={name}
        name={name}
        labelText={t("givenNameLabelText","Prénom")+star}
        light={true}
        placeholder={t("givenNameLabelText","Prénom")+star}
        hideLabel={true}

      />
    </>
  );
};
