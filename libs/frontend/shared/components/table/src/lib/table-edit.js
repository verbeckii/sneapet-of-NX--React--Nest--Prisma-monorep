// table cell definition section for editable cells

import { Textarea, Input, Checkbox } from '@cloudscape-design/components';

export const textEditFn = (id, disabledFn) => ({
  ariaLabel: 'nota',
  editIconAriaLabel: 'editable',
  errorIconAriaLabel: 'Name Error',
  editingCell: (item, { currentValue, setValue }) => {
    return (
      <Textarea
        autoFocus={true}
        value={currentValue ?? item[id]}
        onChange={(event) => setValue(event.detail.value)}
        disabled={disabledFn ? disabledFn(item) : false}
      />
    );
  },
});

export const booleanEditFn = (id, disabledFn) => ({
  ariaLabel: 'nota',
  editIconAriaLabel: 'editable',
  errorIconAriaLabel: 'Name Error',
  editingCell: (item, { currentValue, setValue }) => {
    return (
      <Checkbox
        autoFocus={true}
        checked={currentValue ?? item[id]}
        onChange={(event) => setValue(event.detail.checked)}
        disabled={disabledFn ? disabledFn(item) : false}
      />
    );
  },
});

export const numberEditFn = (id, disabledFn) => ({
  ariaLabel: 'nota',
  editIconAriaLabel: 'editable',
  errorIconAriaLabel: 'Name Error',
  editingCell: (item, { currentValue, setValue }) => {
    return (
      <Input
        type="number"
        autoFocus={true}
        value={currentValue ?? item[id]}
        onChange={(event) => setValue(+event.detail.value)}
        disabled={disabledFn ? disabledFn(item) : false}
      />
    );
  },
});
