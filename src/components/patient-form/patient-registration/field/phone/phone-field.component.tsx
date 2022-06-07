import React, { useContext } from 'react';
import { PhoneInput } from '../../input/custom-input/phone/phone-field.component';
import { useTranslation } from 'react-i18next';
import { PatientRegistrationContext } from '../../patient-registration-context';

interface PhoneFieldProps{
  name: string;
  value?: string;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({name,value}) => {
  const { t } = useTranslation();
  const { setFieldValue } = useContext(PatientRegistrationContext);
  console.log(name, value)
  return (
    <div>
      <PhoneInput id={name} value={value} name={name} placeholder={t('phoneNumberInputLabelText', 'Téléphone')} setPhoneValue={setFieldValue}/>
    </div>
  );
};
