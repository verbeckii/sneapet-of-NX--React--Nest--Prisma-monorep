import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Tiles as CSTiles } from '@cloudscape-design/components';

export const Tiles = ({ name, control, options, defaultValue, ...props }) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue.value);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, onChange } }) => (
        <CSTiles
          value={selectedOption}
          items={options}
          onBlur={onBlur}
          onChange={({ detail }) => {
            setSelectedOption(detail.value);
            onChange(detail.value);
          }}
          {...props}
        />
      )}
    />
  );
};
