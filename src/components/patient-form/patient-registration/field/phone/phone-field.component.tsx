import React, { useContext } from 'react';
import { PhoneInput } from '../../input/custom-input/phone/phone-field.component';
import { useTranslation } from 'react-i18next';

interface PhoneFieldProps {
  name: string;
  value?: any;
  className?: string;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({ name, className,value }) => {
  const { t } = useTranslation();
  const prefix = "+(509)"

  return (
    <div>
      <PhoneInput id={name} prefix={prefix}
        name={name}
        placeholder={t('phoneNumberInputLabelText', 'Phone')}
        className={className}
         />
    </div>
  );
};
