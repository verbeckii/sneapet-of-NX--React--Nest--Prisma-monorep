export const devicesBreadcrumbs = [
  {
    text: 'Anagrafiche',
    href: '/',
  },
  {
    text: 'Devices',
    href: '/devices',
  },
];

export const deviceDetailBreadcrumb = (item) =>
  item
    ? [
        ...devicesBreadcrumbs,
        {
          text: item.Description,
          href: `/device/${item.id}`,
        },
        {
          text: 'Edit',
          href: '',
        },
      ]
    : devicesBreadcrumbs;

export const deviceCreateBreadcrumbs = [
  {
    text: 'Anagrafiche',
    href: '/',
  },
  {
    text: 'Devices',
    href: '/devices',
  },
  {
    text: 'New Device',
    href: '',
  },
];
