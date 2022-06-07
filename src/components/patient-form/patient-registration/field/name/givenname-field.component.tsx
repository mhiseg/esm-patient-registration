import React from 'react';
import { Input } from '../../input/basic-input/input/input.component';
import { useTranslation } from 'react-i18next';
import styles from '../field.scss';


interface GivenNameFieldProps{
  name: string;
  className?: boolean
}

export const GivenNameField:React.FC<GivenNameFieldProps> = ({name, className}) => {
  const { t } = useTranslation();
  return(
    <>
      <Input
        className={className == false ?styles.margin_field:""}
        id={name}
        name={name}
        labelText={t("givenNameLabelText","Given Name")}
        light={true}
        placeholder={t("givenNameLabelText", "Given name")+" *"}
        hideLabel={true}
      />
    </>
  );
};
