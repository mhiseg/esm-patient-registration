import React, { useContext, useEffect, useState } from 'react';
import { RadioButton, RadioButtonGroup } from 'carbon-components-react';
import styles from '../field.scss';
import { useTranslation } from 'react-i18next';
import { PatientRegistrationContext } from '../../patient-registration-context';
import { useField } from 'formik';
import { fetchConceptByUuid, getConceptAnswer, getSynchronizedCurrentUser } from '../../patient-registration.resource';
import { habitatConcept } from '../../../../constants';

export interface HabitatProps{
  className?: string;
}
export const HabitatField: React.FC<HabitatProps> = ({className}) => {
  const { t } = useTranslation();
  const [field, meta] = useField('habitat');
  const { setFieldValue } = useContext(PatientRegistrationContext);
  const [answers, setAnswers] = useState([])
  const [question, setQuestion] = useState("");
  
  useEffect(() => {
    const currentUserSub = getSynchronizedCurrentUser({ includeAuthStatus: true }).subscribe(async user => {
      await fetchConceptByUuid(habitatConcept, localStorage.getItem("i18nextLng")).then(res => {
        setAnswers(getConceptAnswer(res.data, setQuestion))
      })
    });

    return () => {
      currentUserSub;
    };
  }, []);


  const setHabitat = (habitat: string) => {
    setFieldValue('habitat', habitat);
  };

  return (
    <>
      <RadioButtonGroup
        className={className}
        labelPosition="right"
        legendText={question}
        name="habitat"
        valueSelected={field.value}
        onChange={setHabitat}
      >
        {answers.map((answer)=>{
          return <RadioButton labelText={answer.display} value={answer.uuid} id={answer.display} />
        })}
      </RadioButtonGroup>
    </>
  );
};
