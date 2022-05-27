import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../input/basic-input/input/input.component';


export const AddressField: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Input
        id="adress"
        name="adress"
        labelText={t('addressHeader', 'Address')}
        light={true}
        placeholder={t('addressHeader', 'Address')}
        hideLabel={true}
      />
    </>
  );
};
