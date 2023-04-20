import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Select as CSSelect } from '@cloudscape-design/components';

export const Select = ({ name, control, options, defaultValue, ...props }) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, onBlur, onChange, value } }) => (
        <CSSelect
          ref={ref}
          selectedOption={value}
          options={options}
          onBlur={onBlur}
          onChange={({ detail }) => {
            setSelectedOption(detail.selectedOption);
            onChange(detail.selectedOption);
          }}
          placeholder="Select"
          selectedAriaLabel="Selected"
          {...props}
        />
      )}
    />
  );
};
