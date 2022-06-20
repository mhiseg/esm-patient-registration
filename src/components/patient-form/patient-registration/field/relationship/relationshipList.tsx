import { fetchRelationshipType } from "../../patient-registration.resource";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectCustom } from '../../input/custom-input/custom-select/custom-selected-component';

interface RelationTypeList {
  uuid: string;
  display: string;
}

interface RelationTypeprops{
   name:string; 
   value:string;
}
export const RelationTypeList: React.FC<RelationTypeprops> = ({name,value}) => {
  const [displayRelationships, setDisplayRelationships] = useState<Array<RelationTypeList>>([]);
  const { t } = useTranslation();
  
  useEffect(() => {
    const unsubscribe = fetchRelationshipType().then(res => setDisplayRelationships(res.data.results))
    return () => { unsubscribe }
}, [])

console.log(name,'********************',)
  return (
    <>
      <SelectCustom
        options={[ ...displayRelationships]}
        label={t(`selectRelationships`, "Select Relationships")}
        name={name}
      />
    </>
  );
};
