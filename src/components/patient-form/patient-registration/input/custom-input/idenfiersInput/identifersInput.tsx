import React, { useContext, useEffect, useState } from 'react';
import styles from '../../../field/field.scss';
import { formatCin, formatNif } from './id-utils';
import { TextInput } from 'carbon-components-react';
import { useField } from 'formik';
import { PatientRegistrationContext } from '../../../patient-registration-context';
import { useTranslation } from 'react-i18next';
import { cinUuid, nifUuid } from '../../../../../constants';

interface InputProps {
    id: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export const IdentInput: React.FC<InputProps> = (props) => {
    const [field, meta, helpers] = useField(props.name);
    const { setValue, setError } = helpers;
    const [required, setRequired] = useState(false)
    const { identifierType } = useContext(PatientRegistrationContext);
    const { t } = useTranslation();

    const handleMaskChange = (identifierType)=>{
        let mask;
        if (!identifierType) {
            mask="Identifiant";
            return mask;
        }

        if (identifierType == cinUuid) {
            mask="0000000000";
            return mask;
        }
        if (identifierType == nifUuid){
            mask="000-000-000-0";
            return mask;   
        }
    }
    
    const handleChange = (e, value) => {
        if (identifierType == cinUuid) {
            setValue(formatCin(e.target.value));
        }
        else {
            e.target.value = formatNif(value);
            setValue(e.target.value)
        }
    }

    return (
        <div>
            <TextInput
                className={""}
                labelText={''}
                {...props}
                {...field}
                invalid={!!(meta.error)}
                invalidText={t(meta.error)}
                onChange={(e) => {
                    const { value } = e.target;
                    handleChange(e, value)
                }}
                light={true}
                value={field.value}
                placeholder={handleMaskChange(identifierType)}
                required={required}
            />
        </div>
    );
};
