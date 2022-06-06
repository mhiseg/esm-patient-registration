import React from 'react';
import { Input } from '../../input/basic-input/input/input.component';
import { useTranslation } from 'react-i18next';
import styles from '../field.scss';


export const LastNameField: React.FC = () => {
  const { t } = useTranslation();

  return(
    <>
      <Input
        className={styles.margin_field}
        id="familyName"
        name="familyName"
        labelText={t("familyNameLabelText", "Nom")}
        light={true}
        placeholder={t("familyNameLabelText", "Nom")+" *"}
        hideLabel={true}
      />
    </>
  );
};
