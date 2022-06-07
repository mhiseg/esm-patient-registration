import React from 'react';
import { Input } from '../../input/basic-input/input/input.component';
import { useTranslation } from 'react-i18next';
import styles from '../field.scss';

interface FamilyNameFieldProps{
  name: string,
  className?: boolean
}
export const FamilyNameField: React.FC<FamilyNameFieldProps> = ({name, className}) => {
  const { t } = useTranslation();

  return(
    <>
      <Input
        className={className == false ?styles.margin_field:""}
        id={name}
        name={name}
        labelText={t("familyNameLabelText", "Nom")}
        light={true}
        placeholder={t("familyNameLabelText", "Nom")+" *"}
        hideLabel={true}
      />
    </>
  );
};
