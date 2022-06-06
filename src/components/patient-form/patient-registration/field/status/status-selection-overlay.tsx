import React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectInput } from '../../input/basic-input/select/select-input.component';


export const StatuField: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SelectInput
        options={[t('situation-1', 'Marié'), t('situation-2', 'Célibataire'), t('situation-3', 'Veuf'), t('situation-4', 'Divorcé')]}
        label="Status"
        name="status"
      />
    </>
  );
};