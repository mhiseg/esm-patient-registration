import React, { useContext } from 'react';
import { RadioButton, RadioButtonGroup } from 'carbon-components-react';
import styles from '../field.scss';
import { useTranslation } from 'react-i18next';
import { PatientRegistrationContext } from '../../patient-registration-context';
import { useField } from 'formik';

export interface HabitatProps{
  className?: string;
}
export const HabitatField: React.FC<HabitatProps> = ({className}) => {
  const { t } = useTranslation();
  const [field, meta] = useField('habitat');
  const { setFieldValue } = useContext(PatientRegistrationContext);

  const setHabitat = (habitat: string) => {
    setFieldValue('habitat', habitat);
  };

  return (
    <>
      <RadioButtonGroup
        className={className}
        labelPosition="right"
        legendText={t('habitatLabelText', 'Habitat')}
        name="habitat"
        valueSelected={field.value}
        onChange={setHabitat}
      >

        <RadioButton labelText={t('urbainLabelText', 'Urbain')} value="urbain" id="urbain" />
        <RadioButton labelText={t('ruralLabelText', 'Rural')} value="rural" id="rural" />
      </RadioButtonGroup>
    </>
  );
};
