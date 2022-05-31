import React from 'react';
import { Input } from '../../input/basic-input/input/input.component';
import { useTranslation } from 'react-i18next';



export const LastNameField = () => {
  const { t } = useTranslation();

  return(
    <>
      <Input
        id="familyName"
        name="familyName"
        labelText="Nom"
        light={true}
        placeholder={t('familyNameLabelText', 'Nom')}
        hideLabel={true}
      />
    </>
  );
};
