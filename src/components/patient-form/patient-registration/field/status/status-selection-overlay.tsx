import React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectInput } from '../../input/basic-input/select/select-input.component';
import styles from '../field.scss';


export const StatusField: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SelectInput
        className={styles.margin_field}
        options={[t('situation-1', 'Marié'), t('situation-2', 'Célibataire'), t('situation-3', 'Veuf'), t('situation-4', 'Divorcé')]}
        label="Status"
        name="status"
      />
    </>
  );
};