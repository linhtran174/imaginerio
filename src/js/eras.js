
const eras = [
  {
    attachments: '',
    center: [21.046844, 105.827351],
    dates: [1858, 1945],
    description: '',
    increment: 1,
    name: 'French Colonial',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [21.046844, 105.827351],
    dates: [1945, 1976],
    description: '',
    increment: 1,
    name: 'Warring Era',
    notes: '',
    zoom: 15,
  },
  {
    attachments: '',
    center: [21.046844, 105.827351],
    dates: [1976, 1986],
    description: '',
    increment: 1,
    name: 'Unified Era',
    notes: '',
    zoom: 15,
  },
  {
    attachments: '',
    center: [21.046844, 105.827351],
    dates: [1986, new Date().getFullYear()],
    description: '',
    increment: 1,
    name: 'Renovated Era',
    notes: '',
    zoom: 14,
  },
];

// _.reduce(eras, (m, e) => m + Math.round((e.dates[1] - e.dates[0]) / e.increment), 0);

export default eras;
