import React, { useContext, useEffect, useState } from 'react';
import styles from '../../../field/field.scss';
import {formatCin,formatNif} from './id-utils';
import { TextInput } from 'carbon-components-react';
import { useField } from 'formik';
import { PatientRegistrationContext } from '../../../patient-registration-context';

interface InputProps {
    id: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export const IdentInput: React.FC<InputProps> = (props) => {
    const [field, meta, helpers] = useField(props.name);
    const { setValue,setError } = helpers;
    const [mask, setMask] = useState(props.placeholder);
    const [required,setRequired]=useState(false)
    const {identifierType}= useContext(PatientRegistrationContext);

    
    const handleChange = (e, value) => {
        if (identifierType[0] == '3') {
            setMask("0000000000");
            setValue(formatCin(e.target.value));           
        }
        else {
            e.target.value = formatNif(value);
            setMask("000-000-000-0");
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
                invalid={!!(meta.touched && meta.error)}
                invalidText={meta.error}
                onChange={(e) => {
                    const { value } = e.target;
                    handleChange(e, value)
                }}
                light={true}
                value={field.value}
                placeholder={mask}
                required={required}
            />
        </div>
    );
};
