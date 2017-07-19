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
  { id: 0, name: '0 - 2000 SqFt' },
  { id: 1, name: '2001 - 4000 SqFt' },
  { id: 2, name: '4001 - 5000 SqFt' },
  { id: 3, name: '5001+ SqFt' },
  { id: 4, name: 'I am not sure' },
];

export const FLOOR_META_DATA = [
  { value: 0, name: 'Basement' },
  { value: 1, name: '1st floor' },
  { value: 2, name: '2nd floor' },
  { value: 3, name: '3rd floor' },
  { value: 4, name: '4th floor' },
]

export const FLOOR_LIST_DATA = [
  { id: 0, name: 'Basement', desc: 'Basement' },
  { id: 1, name: '1', desc: '1st Floor' },
  { id: 2, name: '2', desc: '2nd Floor' },
  { id: 3, name: '3', desc: '3rd Floor' },
  { id: 4, name: '4', desc: '4th Floor' }
]

export const FLOOR_OPTIONS_DATA = [
  { id: 0, name: 'Basement', checked: false },
  { id: 1, name: '1', checked: false },
  { id: 2, name: '2', checked: false },
  { id: 3, name: '3', checked: false },
  { id: 4, name: '4', checked: false }
]
