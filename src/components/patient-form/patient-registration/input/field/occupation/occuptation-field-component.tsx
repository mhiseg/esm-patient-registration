import React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectInput } from '../../input/basic-input/select/select-input.component';


export const OccupationSelect: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <SelectInput
                options={[t('occupation-1', 'Informaticien'), t('occupation-2', 'Ing Civil'), t('occupation-3', 'Infirmiere'), t('situation-4', 'Médecin')]}
                label="Occupation"
                name="occupation"
            />
        </>
    );
};