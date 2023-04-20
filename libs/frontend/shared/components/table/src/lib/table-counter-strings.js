export const getFilterCounterText = (count) =>
  `${count} ${count === 1 ? 'trovato' : 'trovati'}`;

export const getTextFilterCounterServerSideText = (
  items = [],
  pagesCount,
  pageSize
) => {
  const count =
    pagesCount > 1 ? `${pageSize * (pagesCount - 1)}+` : items.length + '';
  return count === '1' ? `1 trovato` : `${count} trovati`;
};

export const getHeaderCounterText = (items, selectedItems) =>
  selectedItems && selectedItems?.length > 0
    ? `(${selectedItems.length}/${items.length})`
    : `(${items.length})`;

export const getHeaderCounterServerSideText = (totalCount, selectedCount) =>
  selectedCount && selectedCount > 0
    ? `(${selectedCount}/${totalCount}+)`
    : `(${totalCount}+)`;
