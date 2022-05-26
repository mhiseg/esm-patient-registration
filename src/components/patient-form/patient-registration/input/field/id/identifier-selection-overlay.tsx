import React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectInput } from '../../input/basic-input/select/select-input.component';


export const IdField: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SelectInput
        options={[t('TypeCIN', 'Carte d\'identification nationale'), t('TypeNIF', 'Numero d\'identification fiscal')]}
        label="Identifier type"
        name="identifier"
      />
    </>
  );
};