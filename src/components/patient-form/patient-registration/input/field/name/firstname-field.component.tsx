import React from 'react';
import { Input } from '../../input/basic-input/input/input.component';
import { useTranslation } from 'react-i18next';



export const NameField = () => {
  const { t } = useTranslation();

  return(
    <>
      <Input
        id="givenName"
        name="givenName"
        labelText="Prenom"
        light={true}
        placeholder={t('givenNameLabelText', 'Prenom')}
        hideLabel={true}
      />
    </>
  );
};
