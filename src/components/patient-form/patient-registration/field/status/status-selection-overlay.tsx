import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { skip } from 'rxjs/operators';
import { maritalStatusConcept } from '../../../../constants';
import { SelectInput } from '../../input/basic-input/select/select-input.component';
import { SelectCustom } from '../../input/custom-input/custom-select/custom-selected-component';
import { Concept } from '../../patient-registration-types';
import { fetchConceptByUuid } from '../../patient-registration.resource';
import styles from '../field.scss';


export const StatusField: React.FC = () => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState([])
  const [question, setOptions] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchConceptByUuid(maritalStatusConcept).then(res => setAnswers(getConceptAnswer(res.data)))
    return () => { unsubscribe }
  }, [])

  const getConceptNameByLocale = (name) => {
    // return names.map(name => (name.locale == localStorage.getItem("i18nextLng")));
  }

  const getConceptAnswer = (concept) => {
    let answers = [];

    answers = concept.answers.map(answer => {
      console.log("concept: ", answer.uuid)
      let name = "";
      if (answer.name?.locale == localStorage.getItem("i18nextLng")){
        console.log(answer, '==========')

        name = answer.name.name;
      }
      else if(answer.names.length > 0){
        console.log(answer, '==========')
        name = answer.names[0].display

      }else{
        skip
      }
      return ({ uuid: answer.uuid, name: name, display: name })
    })
    console.log(answers, '==========')
    return answers;
  }

  return (
    <>
      <SelectCustom
        options={[...answers]}
        label={t("selectIdentifier", "Select identifer")}
        name="identifierType"
      />
    </>
  );
};