import React, { useContext, useState } from 'react';
import { Column,  DatePicker, DatePickerInput, NumberInput, Row } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import { PatientRegistrationContext } from '../../patient-registration-context';
import styles from '../../field/field.scss';
import { useField } from 'formik';


interface DobFieldProps {
  birthdate?: Date;
  birthdateEstimated: boolean;
  age?: number;
  months?: number;
}
const today: Date = new Date();

export const DobField: React.FC<DobFieldProps> = (props) => {
  const { t } = useTranslation();
  const [dob, setDob] = useState(calculDate(props.age, props.months, props.birthdate));
  const { setFieldValue } = useContext(PatientRegistrationContext);
  const [birthdate, birthdateMeta] = useField('dob');

  const onDateChange = ([birthdate]) => {
    setDob(dateDiff(new Date(birthdate), today));
    setFieldValue('dob', { ...dob, birthdateEstimated: false });
  };
  function dateDiff(date1, date2) {
    var tmp = date2 - date1;
    if (tmp > 0) {
      var days = tmp / (1000 * 3600 * 24)
      var years = Math.trunc(days / 365)
      var months = Math.trunc((days % 365) / 30);
      return { birthdate: date1, age: years, months: months };
    } else {
      return { birthdate: today, age: 0, months: 0 };
    }
  }

  function calculDate(y: number, m: number, birthdate?) {
    if (birthdate)
      return dateDiff(birthdate, today);
    var currentYear = new Date();
    var age = (y == null) ? 0 : y;
    var months = (m == null) ? 0 : m;
    if (age !== 0 || months !== 0) {
      currentYear.setMonth(currentYear.getMonth() - months);
      currentYear.setFullYear(currentYear.getFullYear() - age);
      return ({ birthdate: currentYear, age: age, months: months })

    }else{
      return ({ birthdate: undefined, age: undefined, months: 0 })

    }
  }

  const onEstimatedAgeChange = (ev) => {
    const years = +ev.target.value;
    if (years && !isNaN(years) && years < 140 && years > 0)
      setDob(calculDate(years, dob.months))
    else
      setDob(calculDate(0, dob.months))
  };

 const onChange = () => {
    setFieldValue('dob', { ...dob, birthdateEstimated: true });
  }

  const onEstimatedMonthChange = (ev) => {
    const months = ev.target.value;
    if (months && !isNaN(months) && months < 12 && months >= 0)
      setDob(calculDate(dob.age, months))
    else
      setDob(calculDate(dob.age, 0))
  };
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
          value={dob.birthdate}
          
        >
          <DatePickerInput
            id="birthdate"
            labelText="Date Picker label"
            hideLabel={true}
            placeholder={"dd/mm/yyyy"+" *"}
            size="md"
            invalid={!!(birthdateMeta.error)}
            invalidText={t(birthdateMeta.error)}
          />
        </DatePicker>
      </Column>

      <Column >
        <NumberInput
          name="age"
          id="carbon-number"
          invalidText="L'age ne doit pas etre inferieur a 0 et superieur 1000"
          max={200}
          min={0}
          size="md"
          allowEmpty={true}
          light={true}
          hideSteppers={true}
          value={dob?.age}  
          onChange={onEstimatedAgeChange}
          onBlur={onChange}
          placeholder="Ans"
        />
      </Column>
      <Column >
        <NumberInput
          id="carbon-number"
          name="months"
          invalidText="Le nombre de mois doit etre compris entre 1 et 12"
          max={11}
          min={0}
          size="md"
          allowEmpty={true}
          light={true}
          hideSteppers={true}
          value={dob?.months}
          onChange={onEstimatedMonthChange}
          onBlur={onChange}
          placeholder="Mois"
        />
      </Column >
    </Row>
  );
};

