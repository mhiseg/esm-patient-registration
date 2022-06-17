import React from 'react';
import { useField } from 'formik';
import { SelectItem, Select } from 'carbon-components-react';

interface SelectInputProps {
  name: string;
  options: Array<string>;
  label: string;
  className?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({ name, options, label,className }) => {
  const [field, meta] = useField(name);
  const selectOptions = [
    <SelectItem disabled hidden text={`Select ${label}`} key="" value="" />,
    ...options.map((currentOption, index) => <SelectItem text={currentOption} value={currentOption} key={index} />),
  ];

  return (
    <div>
      <Select 
      id="identifier"
      {...field} 
      labelText={label} 
      light={true} size="md" 
      className = {className}
      hideLabel={true}>
      {selectOptions}
      </Select>
    </div>
  );
};
