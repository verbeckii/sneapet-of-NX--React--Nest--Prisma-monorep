import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { RadioGroup as CSSRadioGroup } from '@cloudscape-design/components';

export const RadioGroup = ({
  name,
  control,
  options,
  defaultValue,
  ...props
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue.value);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, onChange } }) => (
        <CSSRadioGroup
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
