// Genera el hash de una contraseña para pegarlo en ADMIN_PASSWORD_HASH.
//
//   node scripts/hash-password.mjs
//
// Pide la contraseña por teclado sin mostrarla, para que no quede en el
// historial del terminal. También acepta que se la pasen por tubería:
//
//   echo "mi contraseña" | node scripts/hash-password.mjs
//
// IMPORTANTE: el formato y los parámetros de abajo deben coincidir con los de
// src/lib/auth.ts. Si se cambian allí, hay que cambiarlos aquí.

import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { createInterface } from 'node:readline';

const scrypt = promisify(scryptCallback);
const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 96 * 1024 * 1024 };
const KEY_LENGTH = 64;

async function readPassword() {
  // Si llega por tubería, se lee tal cual.
  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '');
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });

  return new Promise((resolve) => {
    process.stdout.write('Contraseña: ');
    // Silencia el eco: readline sigue recibiendo las teclas, pero no se imprimen.
    rl._writeToOutput = () => {};
    rl.question('', (answer) => {
      process.stdout.write('\n');
      rl.close();
      resolve(answer);
    });
  });
}

const password = await readPassword();

if (!password) {
  console.error('No se recibió ninguna contraseña.');
  process.exit(1);
}

if (password.length < 12) {
  console.error(`La contraseña tiene ${password.length} caracteres. Usa al menos 12.`);
  process.exit(1);
}

const salt = randomBytes(16);
const key = await scrypt(password.normalize('NFKC'), salt, KEY_LENGTH, SCRYPT);
const hash = ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64'), key.toString('base64')].join(':');

console.log('\nPega estas líneas en tu .env y en las Environment Variables de Vercel:\n');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log(`SESSION_SECRET="${randomBytes(32).toString('hex')}"`);
console.log(
  '\nEl SESSION_SECRET de arriba es nuevo. Si lo cambias, se cierran todas las sesiones abiertas.\n',
);
