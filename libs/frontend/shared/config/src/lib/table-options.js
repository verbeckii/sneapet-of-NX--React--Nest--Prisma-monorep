export const CARDS_PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 Righe' },
  { value: 30, label: '30 Righe' },
  { value: 50, label: '50 Righe' },
];

export const PROPERTY_FILTERING_I18N_CONSTANTS = {
  filteringAriaLabel: 'your choice',
  dismissAriaLabel: 'Dismiss',

  filteringPlaceholder: 'Filtro per testo, proprietà o valore',
  groupValuesText: 'Valori',
  groupPropertiesText: 'Proprietà',
  operatorsText: 'Operatori',

  operationAndText: 'e',
  operationOrText: 'o',

  operatorLessText: 'Minore di',
  operatorLessOrEqualText: 'Minire di o uguale a',
  operatorGreaterText: 'Maggiore di',
  operatorGreaterOrEqualText: 'Maggiore di o uguale a',
  operatorContainsText: 'Contiene',
  operatorDoesNotContainText: 'Non contiene',
  operatorEqualsText: 'Uguale a',
  operatorDoesNotEqualText: 'Diverso da',

  editTokenHeader: 'Modifica filtro',
  propertyText: 'Proprietà',
  operatorText: 'Operatore',
  valueText: 'Valore',
  cancelActionText: 'Annulla',
  applyActionText: 'Applica',
  allPropertiesLabel: 'Tutte le proprietà',

  tokenLimitShowMore: 'Mostra di più',
  tokenLimitShowFewer: 'Mostra di meno',
  clearFiltersText: 'Pulisci tutti i filtri',
  removeTokenButtonAriaLabel: () => 'Remove token',
  enteredTextLabel: (text) => `Usa: "${text}"`,
};
