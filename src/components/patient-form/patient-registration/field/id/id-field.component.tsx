import React from 'react';
import { Input } from '../../input/basic-input/input/input.component';
import { useTranslation } from 'react-i18next';



export const IdField: React.FC = () => {
  const { t } = useTranslation();

  return(
    <>
      <Input
        id="identifier"
        name="identifier"
        labelText="Identifiant"
        light={true}
        placeholder={t("idFieldLabelText", "Identifier")}
        hideLabel={true}
      />
    </>
  );
};

