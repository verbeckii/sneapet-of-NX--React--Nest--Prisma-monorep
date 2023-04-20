import { Controller } from 'react-hook-form';
import { Textarea as CSTextarea } from '@cloudscape-design/components';

export const Textarea = ({ name, control, ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { ref, onChange, onBlur, value } }) => (
      <CSTextarea
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
