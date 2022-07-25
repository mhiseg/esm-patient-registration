import React from 'react';
import { useField } from 'formik';
import { SelectItem, Select } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';

interface InputSelectProps {
  name: string;
  options: any[];
  label: string;
  className?: string;
}

export const SelectCustomObs: React.FC<InputSelectProps> = ({name, options, label, className}) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const { t } = useTranslation();
  const selectOptions = [
    <SelectItem text={label} key="" value={undefined} />,
    ...options.map((currentOption, index) => <SelectItem text={t(currentOption.display)} value={currentOption.uuid} key={index} />)
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
        invalid={!!(meta.error && meta.touched)}
        invalidText={meta.error}
        value={field?.value.value || ""}
        onChange={(e) => setValue({...field.value, value: e.target.value})}
      >
        {selectOptions}
      </Select>
    </div>
  );
};
