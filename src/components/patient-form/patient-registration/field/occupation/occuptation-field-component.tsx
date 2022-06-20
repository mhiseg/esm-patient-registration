import { createErrorHandler } from '@openmrs/esm-framework';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { occupationConcept } from '../../../../constants';
import { SelectCustom } from '../../input/custom-input/custom-select/custom-selected-component';
import { fetchConceptByUuid, getConceptAnswer, getSynchronizedCurrentUser } from '../../patient-registration.ressources';
import styles from '../field.scss';

export const OccupationSelect: React.FC = () => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState([])
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const currentUserSub = getSynchronizedCurrentUser({ includeAuthStatus: true }).subscribe(async user => {
      await fetchConceptByUuid(occupationConcept, localStorage.getItem("i18nextLng")).then(res => {
        setAnswers(getConceptAnswer(res.data,setQuestion))
      })
    });

    return () => {
      currentUserSub;
    };
  }, []);



  return (
    <>
      <SelectCustom
        className={styles.margin_field}
        options={[...answers]}
        label={t('Select') + ' ' + question}
        name="occupation"
      />
    </>
  );

};