import React, { useContext } from 'react';
import { useField } from 'formik';
import { SelectItem, Select } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import { PatientRegistrationContext } from '../../../patient-registration-context';

interface InputSelectProps {
  name: string;
  options: Array<any>;
  label: string;
  className?: string;
}

export const SelectCustom: React.FC<InputSelectProps> = ({ name, options, label, className }) => {
  const [field, meta] = useField(name);
  const { t } = useTranslation();

  const selectOptions = [
    <SelectItem text={label} key="" value={undefined} />,
    ...options.map((currentOption, index) => <SelectItem text={t(currentOption.display)} value={currentOption.uuid} key={index} />
    ),
  ];


  return (
    <div>
      <Select
        id="identifierType"
        {...field}
        labelText={label}
        light={true}
        size="md"
        className={className}
        hideLabel={true}
        invalid={!!meta.error}
        invalidText={t(meta.error)}
      >
        {selectOptions}
      </Select>
    </div>
  );
};
