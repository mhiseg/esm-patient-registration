import React from 'react';
import { Input } from '../../input/basic-input/input/input.component';
import { useTranslation } from 'react-i18next';
import styles from '../field.scss';


export const GivenNameField:React.FC = () => {
  const { t } = useTranslation();

  return(
    <>
      <Input
        className={styles.margin_field}
        id="givenName"
        name="givenName"
        labelText={t("givenNameLabelText","Given Name")}
        light={true}
        placeholder={t("givenNameLabelText", "Given name")+" *"}
        hideLabel={true}
      />
    </>
  );
};
