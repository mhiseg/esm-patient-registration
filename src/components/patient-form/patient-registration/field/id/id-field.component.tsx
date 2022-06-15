import React from 'react';
import { useTranslation } from 'react-i18next';
import { IdentInput } from '../../input/custom-input/idenfiersInput/identifersInput';


export const IdField: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <IdentInput
        id="identifier"
        name="identifier"
        placeholder={t("idFieldLabelText", "Identifier")}
      />
    </>
  );
};

