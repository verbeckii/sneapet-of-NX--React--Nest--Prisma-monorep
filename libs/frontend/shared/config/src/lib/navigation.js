export const navHeader = { text: 'Visionarea Admin', href: '/' };
export const navItems = [
  {
    type: 'section',
    text: 'Anagrafiche',
    items: [
      { type: 'link', text: 'Devices', href: '/devices' },
      { type: 'link', text: 'Create new device', href: '/device/create' },
    ],
  },
  {
    type: 'section',
    text: 'Acquisti',
    items: [
      { type: 'link', text: 'Fornitori', href: '/suppliers' },
      { type: 'link', text: 'Ordini', href: '/purchaseorders' },
    ],
  },
];