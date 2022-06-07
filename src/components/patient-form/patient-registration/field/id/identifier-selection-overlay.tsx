import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectCustom } from '../../input/custom-input/custom-select/custom-selected-component';
import { IdentifierSource } from '../../patient-registration-types';
import { fetchIdentifierType } from './patient-identifier-ressource';

export const IdSelect: React.FC = () => {
  const { t } = useTranslation();
  const identiferSelected = [ "CIN","NIF"]
  const [identifiers, setIdentifier] = useState<Array<IdentifierSource>>([]);

  useEffect(() => {
    fetchIdentifierType().then(res =>setIdentifier(getIdentifier(res.data.results)))
  }, [identifiers])

  const getIdentifier = (identifiers) => {
    let ids = [];
    identiferSelected.forEach(el => {
      identifiers.map(id => {
        if(id.display.toUpperCase().includes(el)){
          ids.push({ uuid: id.uuid, name: id.name, description: id.description, display: id.display})
        }
      })
    });

    return ids.filter(element => element !== null)
  }

  return (
    <>
      <SelectCustom
        options={[ ...identifiers]}
        label={t("selectIdentifier", "Select identifer")}
        name="identifierType"
      />
    </>
  );
};