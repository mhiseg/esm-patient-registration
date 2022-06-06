import React from 'react';
import { useField } from 'formik';
import { SelectItem, Select } from 'carbon-components-react';
import { IdentifierSource } from '../../../patient-registration-types';
import { useTranslation } from 'react-i18next';

interface InputSelectProps {
  name: string;
  options: Array<IdentifierSource>;
  label: string;
  className?: string;
}

export const SelectCustom: React.FC<InputSelectProps> = ({ name, options, label,className }) => {
  const [field, meta] = useField(name);
  const { t } = useTranslation();

  const selectOptions = [
    <SelectItem disabled hidden text={label} key="" value="" />,
    ...options.map((currentOption, index) => <SelectItem text={t(currentOption.name)} value={currentOption.uuid} key={index} />),
  ];
  
  return (
    <div>
      <Select 
        id="identifierType" {...field} 
        labelText={label} 
        light={true} size="md" 
        className = {className}
        hideLabel={true}>      
        {selectOptions}
      </Select>
    </div>
  );
};
