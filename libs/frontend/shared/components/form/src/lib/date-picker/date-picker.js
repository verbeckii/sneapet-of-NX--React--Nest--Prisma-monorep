import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker as CSDatePicker } from '@cloudscape-design/components';

export const DatePicker = ({
  name,
  control,
  options,
  defaultValue,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, onChange } }) => (
        <CSDatePicker
          value={value}
          options={options}
          onBlur={onBlur}
          onChange={({ detail }) => {
            setValue(detail.value);
            onChange(detail.value);
          }}
          locale="it-IT"
          placeholder="Formato AAAA/MM/GG"
          nextMonthAriaLabel="Mese successivo"
          previousMonthAriaLabel="Mese precedente"
          todayAriaLabel="Oggi"
          {...props}
        />
      )}
    />
  );
};
