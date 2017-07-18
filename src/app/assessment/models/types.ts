export enum FLOORS {
  Basement,
  First,
  Second,
  Third,
  Fourth
};

export enum SignalStrength {
  GREEN,
  YELLOW,
  RED
};

export const SQFT_META_DATA = [
  { id: 1, name: '0 - 2000 SqFt' },
  { id: 2, name: '2001 - 4000 SqFt' },
  { id: 3, name: '4001 - 5000 SqFt' },
  { id: 4, name: '5001+ SqFt' },
  { id: 5, name: 'I am not sure' },
];

export const FLOOR_META_DATA = [
  { value: 0, name: 'Basement' },
  { value: 1, name: 'First floor' },
  { value: 2, name: 'Second floor' },
  { value: 3, name: 'Third floor' },
  { value: 4, name: 'Fourth floor' },
]

export const FLOOR_LIST_DATA = [
  { id: 0, name: 'Basement', desc: 'basement' },
  { id: 1, name: '1', desc: '1st floor' },
  { id: 2, name: '2', desc: '2nd floor' },
  { id: 3, name: '3', desc: '3rd floor' },
  { id: 4, name: '4', desc: '4th floor' }
]

export const FLOOR_OPTIONS_DATA = [
  { id: 0, name: 'Basement', checked: false },
  { id: 1, name: '1', checked: false },
  { id: 2, name: '2', checked: false },
  { id: 3, name: '3', checked: false },
  { id: 4, name: '4', checked: false }
]
