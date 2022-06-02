import React, { useContext } from 'react';
import { PhoneInput } from '../../input/custom-input/phone/phone-field.component';
import { useTranslation } from 'react-i18next';
import { PatientRegistrationContext } from '../../patient-registration-context';


export const PhoneField: React.FC = () => {
  const { t } = useTranslation();
  const { setFieldValue } = useContext(PatientRegistrationContext);

  return (
    <div>
      <PhoneInput id="phone" name="phone" placeholder={t('phoneNumberInputLabelText', 'Téléphone')} setPhoneValue={setFieldValue}/>
    </div>
  );
};
