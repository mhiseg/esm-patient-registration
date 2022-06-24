import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectCustom } from '../../input/custom-input/idenfiersInput/identifer-overlay';
import { IdentifierSource } from '../../patient-registration-types';
import { fetchIdentifierType } from './patient-identifier-ressource';

export const IdSelect: React.FC = () => {
  const { t } = useTranslation();
  const [identifiers, setIdentifier] = useState<Array<IdentifierSource>>([]);

  useEffect(() => {
    const unsubscribe = fetchIdentifierType().then(res =>getIdentifier(res.data.results))
    return () => { unsubscribe }
  }, [])

  const getIdentifier = (identifiers) => {
    setIdentifier(identifiers.map(id => ({ uuid: id.uuid, name: id.name, description: id.description, display: `${id.description} (${id.name})`})))
  }
  
  return (
    <>
      <SelectCustom
        options={[...identifiers]}
        label={t("selectIdentifier", "Select identifer")}
        name="identifierType"
      />
    </>
  );
};