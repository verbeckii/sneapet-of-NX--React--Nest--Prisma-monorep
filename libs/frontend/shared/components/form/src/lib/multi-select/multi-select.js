import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Multiselect as CSMultiselect } from '@cloudscape-design/components';

export const Multiselect = ({
  name,
  control,
  options,
  defaultValue,
  ...props
}) => {
  const [selectedOptions, setSelectedOptions] = useState(defaultValue);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, onChange } }) => (
        <CSMultiselect
          selectedOptions={selectedOptions}
          options={options}
          onBlur={onBlur}
          onChange={({ detail }) => {
            setSelectedOptions(detail.selectedOptions);
            onChange(detail.selectedOptions);
          }}
          placeholder="Choose options"
          deselectAriaLabel={(e) => `Remove ${e.label}`}
          selectedAriaLabel="Selected"
          {...props}
        />
      )}
    />
  );
};
