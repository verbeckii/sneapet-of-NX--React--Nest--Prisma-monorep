import { Controller } from 'react-hook-form';
import { Input as CSInput } from '@cloudscape-design/components';

export const Input = ({ name, control, ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { ref, onChange, onBlur, value } }) => (
      <CSInput
        ref={ref}
        name={name}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.detail.value)}
        {...props}
      />
    )}
  />
);
