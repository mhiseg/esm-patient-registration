import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { maritalStatusConcept } from '../../../../constants';
import { SelectCustom } from '../../input/custom-input/custom-select/custom-selected-component';
import { fetchConceptByUuid } from '../../patient-registration.resource';
import styles from '../field.scss';


export const StatusField: React.FC = () => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState([])
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const unsubscribe = fetchConceptByUuid(maritalStatusConcept, localStorage.getItem("i18nextLng")).then(res => {
      setAnswers(getConceptAnswer(res.data))})
    return () => { unsubscribe }
  }, [])

  const getConceptAnswer = (concept) => {
    setQuestion(concept.display)
    return (concept.answers).map(answer => {
      return ({ uuid: answer.uuid, name: answer.display, display: answer.display })
    })
  }

  return (
    <>
      <SelectCustom
        className={styles.margin_field}
        options={[...answers]}
        label={t('Select')+' '+question}
        name="status"
      />
    </>
  );
};