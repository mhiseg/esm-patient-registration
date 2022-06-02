// @flow
import * as React from 'react';
import { NumberInput } from "carbon-components-react/lib/components/NumberInput/NumberInput";
import { useField } from 'formik';


export interface NumberProps{
    name: string;
}


export const InputNumber: React.FC <NumberProps> = (props) => {
    const [field, meta] = useField(props.name);
    return (
        <div>
            <NumberInput
                {...field}
                id="carbon-number"
                invalidText={meta.error}
                max={1000}
                min={0}
                size="md"
                value={field.value || ""}
                allowEmpty={true}
                light={true}
                hideSteppers={true}
                invalid={!!(meta.touched && meta.error)}
            />
            <span>{props.name}</span>
        </div>
    );
};