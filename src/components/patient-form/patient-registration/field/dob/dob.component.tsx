import React, { useContext } from 'react';
import { Column, ContentSwitcher, DatePicker, DatePickerInput, NumberInput, Row, Switch, TextInput } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { PatientRegistrationContext } from '../../patient-registration-context';
import { generateFormatting } from '../date-util';
import styles from '../../field/field.scss';

interface DobFiedlProps{
  className?: string;
}

export const DobField: React.FC = (className) => {
  const { t } = useTranslation();
  const [dobUnknown] = useField('birthdateEstimated');
  const dobKnown = !dobUnknown.value;
  const [birthdate, birthdateMeta] = useField('birthdate');
  const [ageEstimate, ageEstimateMeta] = useField('ageEstimate');
  const { setFieldValue } = useContext(PatientRegistrationContext);
  const { format, placeHolder, dateFormat } = generateFormatting(['d', 'm', 'Y'], '/');
  const today = new Date();

  const onToggle = (e) => {
    setFieldValue('birthdateEstimated', e.name === 'unknown');
    setFieldValue('birthdate', '');
    setFieldValue('ageEstimate', '');
  };

  const onDateChange = ([birthdate]) => {
    setFieldValue('birthdate',{date: birthdate});
    console.log(birthdate,'=======================')
  };

  const onEstimatedAgeChange = (ev) => {
    const years = +ev.target.value;

    if (!isNaN(years) && years < 140 && years >= 0) {
      setFieldValue('birthdate', new Date(today.getFullYear() - years, 0, 1));
      setFieldValue('ageEstimate', years);
    }
  };
  // console.log(birthdate.value==undefined,'++++++++++++++++++++++')

  return (
    <Row className={styles.margin_field}>
      <Column>
        <DatePicker
          className=""
          maxDate={today}
          datePickerType="single"
          locale="fr"
          dateFormat="d/m/Y"
          light={true}
          onChange={onDateChange}
        // value={values}
        // onChange={date => setFieldValue('dob', date)}
        >
          <DatePickerInput
            id="date-picker-simple"
            labelText="Date Picker label"
            hideLabel={true}
            placeholder="dd/mm/yyyy"
            size="md"
          />
        </DatePicker>
      </Column>
      <Column >
        <NumberInput
          id="carbon-number"
          invalidText="L'age ne doit pas etre inferieur a 0 et superieur 1000"
          max={1000}
          min={0}
          size="md"
          value={0}
          allowEmpty={true}
          light={true}
          hideSteppers={true}
        />
        {/* <span>ans</span> */}
      </Column>

      <Column >
        <NumberInput
          id="carbon-number"
          invalidText="Le nombre de mois doit etre compris entre 1 et 12"
          max={11}
          min={1}
          size="md"
          value={1}
          allowEmpty={true}
          light={true}
          hideSteppers={true}
          readOnly={birthdate.value !== undefined}
        />
        {/* <span>mois</span> */}
      </Column >
    </Row>
  );
};
      /* {dobKnown ? (
  <div className={styles.dobField}>
    <DatePicker
      dateFormat={dateFormat}
      datePickerType="single"
      light={true}
      locale="fr"
      onChange={onDateChange}
      maxDate={format(today)}>
      <DatePickerInput
        id="birthdate"
        {...birthdate}
        placeholder={placeHolder}
        labelText={t('dateOfBirthLabelText', 'Date of Birth')}
        invalid={!!(birthdateMeta.touched && birthdateMeta.error)}
        invalidText={birthdateMeta.error && t(birthdateMeta.error)}
        value={format(birthdate.value)}
        hideLabel={true}
      />
    </DatePicker>
  </div>
) : (
  <div className={styles.dobField}>
    <TextInput
      id="ageEstimate"
      type="number"
      light
      onChange={onEstimatedAgeChange}
      labelText={t('estimatedYearsLabelText', 'Estimated Years')}
      invalid={!!(ageEstimateMeta.touched && ageEstimateMeta.error)}
      invalidText={ageEstimateMeta.error && t(ageEstimateMeta.error)}
      value={ageEstimate.value}
      min={0}
    />
  </div>
)} */
    // </div>

