import React, { useContext } from 'react';
import { RadioButton, RadioButtonGroup } from 'carbon-components-react';
import styles from '../field.scss';
import { useTranslation } from 'react-i18next';
import { PatientRegistrationContext } from '../../patient-registration-context';
import { useField } from 'formik';

export const GenderField: React.FC = () => {
  const { t } = useTranslation();
  const [field, meta] = useField('gender');
  const { setFieldValue } = useContext(PatientRegistrationContext);

  const setGender = (gender: string) => {
    setFieldValue('gender', gender);
  };

  return (
    <>
      <RadioButtonGroup
        className={styles.margin_field}
        labelPosition="right"
        legendText={t('genderLabelText', 'Sexe*')}
        name="gender"
        valueSelected={field.value}
        onChange={setGender}
      >

        <RadioButton labelText={t('maleLabelText', 'Masculin')} value="M" id="male" />
        <RadioButton labelText={t('femaleLabelText', 'Feminin')} value="F" id="female" />
      </RadioButtonGroup>
      {meta.touched && meta.error && (
        <div className={styles.radioFieldError}>{t(meta.error, 'Gender is required')}</div>
      )}

    </>
  );
};
