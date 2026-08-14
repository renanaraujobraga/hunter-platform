import { copyFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execa } from 'execa';

const apiEnv = new URL('../apps/flight-api/.env', import.meta.url);
const apiEnvExample = new URL('../apps/flight-api/.env.example', import.meta.url);
const webEnv = new URL('../apps/flight-web/.env.local', import.meta.url);
const webEnvExample = new URL('../apps/flight-web/.env.example', import.meta.url);

async function ensureFile(target, source) {
  try {
    await access(target, constants.F_OK);
  } catch {
    await copyFile(source, target);
  }
}

await ensureFile(apiEnv, apiEnvExample);
await ensureFile(webEnv, webEnvExample);

await execa('pnpm', ['db:generate'], { stdio: 'inherit', shell: true });
await execa('pnpm', ['db:migrate'], { stdio: 'inherit', shell: true });
await execa('pnpm', ['db:seed'], { stdio: 'inherit', shell: true });
