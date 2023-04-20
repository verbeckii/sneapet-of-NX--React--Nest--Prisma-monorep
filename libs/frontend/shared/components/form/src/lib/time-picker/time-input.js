import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { TimeInput as CSTimeInput } from '@cloudscape-design/components';
import { convertFromMySqlTime, convertToMySqlTime } from '@visionarea-admin/frontend/shared/function'

export const TimeInput = ({ name, control, defaultValue, ...props }) => {
  const [value, setValue] = useState(convertFromMySqlTime(defaultValue));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, onBlur, onChange } }) => (
        <CSTimeInput
          ref={ref}
          value={value}
          onBlur={onBlur}
          onChange={({ detail }) => {
            setValue(detail.value);
            onChange(convertToMySqlTime(detail.value));  
          }}
          format="hh:mm"
          {...props}
        />
      )}
    />
  );
};
