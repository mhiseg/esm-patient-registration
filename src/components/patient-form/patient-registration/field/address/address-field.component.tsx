import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../input/basic-input/input/input.component';


interface AddressProps {
  value?: string;
  className?: string;
  name?: string;
}

export const AddressField: React.FC<AddressProps> = ({value, className, name}) => {
  const { t } = useTranslation();

  return (
    <>
      <Input
        className={className}
        id='address'
        name='address'
        labelText={t('adresseLabelText', 'Address')}
        light={true}
        placeholder={t('adresseLabelText', 'Address')}
        hideLabel={true}
        value={value}
      />
    </>
  );
};
