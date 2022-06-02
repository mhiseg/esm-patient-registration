import React from 'react';
import { Input } from '../../input/basic-input/input/input.component';
import { useTranslation } from 'react-i18next';
import styles from '../field.scss';


export const NameField:React.FC = () => {
  const { t } = useTranslation();

  return(
    <>
      <Input
        className={styles.margin_field}
        id="firstName"
        name="firstName"
        labelText="Prenom*"
        light={true}
        placeholder={t('givenNameLabelText', 'Prenom*')}
        hideLabel={true}
      />
    </>
  );
};
