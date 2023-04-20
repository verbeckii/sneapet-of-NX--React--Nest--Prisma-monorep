import { useSearchParams } from 'react-router-dom';

const tableDefaultFilterBuilder = (propertyKey, value) => ({
  operation: 'and',
  tokens: [
    {
      operator: '=',
      propertyKey,
      value,
    },
  ],
});

export const useTableDefaultFilter = (
  filterProp = 'filterProp',
  filterValue = 'filterValue'
) => {
  const [searchParams] = useSearchParams();
  const filterInitialProp = searchParams.get(filterProp);
  const filterInitialValue = searchParams.get(filterValue);
  if (!filterInitialProp || !filterInitialValue) return null;
  return tableDefaultFilterBuilder(
    filterInitialProp,
    filterInitialValue.replaceAll('~', ' ')
  );
};

export const setTableFilter = (prop, value, len) =>
  `filterProp=${prop}&filterValue=${
    len ? (value || '').trim().padEnd(len, '~') : value
  }`;
