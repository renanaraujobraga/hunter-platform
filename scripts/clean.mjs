import { rm } from 'node:fs/promises';

const paths = [
  'apps/flight-api/dist',
  'apps/flight-web/.next',
  'apps/flight-web/tsconfig.tsbuildinfo',
  '.turbo',
  'coverage',
];

await Promise.all(paths.map((path) => rm(path, { recursive: true, force: true })));
console.log('Artefatos locais removidos.');
