import { createErrorHandler } from '@openmrs/esm-framework';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { maritalStatusConcept, occupationConcept } from '../../../../constants';
import { SelectCustom } from '../../input/custom-input/custom-select/custom-selected-component';
import { SelectCustomObs } from '../../input/custom-input/custom-select/custom-selected-component-obs';
import { Concept, Obs } from '../../patient-registration-types';
import { fetchConceptByUuid, getConceptAnswer, getSynchronizedCurrentUser } from '../../patient-registration.ressources';
import styles from '../field.scss';

interface StatusProps {
  className?: string;
}
export const StatusField: React.FC<StatusProps> = () => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState([{}])
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const currentUserSub = getSynchronizedCurrentUser({ includeAuthStatus: true }).subscribe(async user => {
      await fetchConceptByUuid(maritalStatusConcept, localStorage.getItem("i18nextLng")).then(res => {
        setAnswers(getConceptAnswer(res.data,setQuestion))
      })
    });

    return () => {
      currentUserSub;
    };
  }, []);

  return (
    <>
      <SelectCustomObs
        className={styles.margin_field}
        options={[...answers]}
        label={t('Select') + ' ' + question}
        name="status"
      />
    </>
  );
};