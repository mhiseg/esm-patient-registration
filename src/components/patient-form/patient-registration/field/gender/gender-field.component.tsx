import React, { useContext } from 'react';
import { RadioButton, RadioButtonGroup } from 'carbon-components-react';
import styles from '../field.scss';
import { useTranslation } from 'react-i18next';
import { PatientRegistrationContext } from '../../patient-registration-context';
import { useField } from 'formik';

export interface GenderFieldProps{
  className?: string;
}

export const GenderField: React.FC<GenderFieldProps> = ({className}) => {
  const { t } = useTranslation();
  const [field, meta] = useField('gender');
  const { setFieldValue } = useContext(PatientRegistrationContext);

  const setGender = (gender: string) => {
    setFieldValue('gender', gender);
  };

  return (
    <>
      <RadioButtonGroup
        className={className}
        labelPosition="right"
        legendText={t('genderLabelText'+" *", 'Sexe *')}
        name="gender"
        valueSelected={field.value}
        onChange={setGender}
      >

        <RadioButton labelText={t('maleLabelText', 'Masculin')} value="M" id="male" />
        <RadioButton labelText={t('femaleLabelText', 'Feminin')} value="F" id="female" />
      </RadioButtonGroup>
      {/* {meta.error && (
        <div className={styles.radioFieldError}>{t(messageError, 'Le patient doit avoir un genre')}</div>
      )} */}

    </>
  );
};
