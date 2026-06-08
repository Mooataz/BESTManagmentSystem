const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const envPath = path.join(__dirname, '.env');
const envRaw = fs.readFileSync(envPath, 'utf-8');
const env = {};
envRaw.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eq = trimmed.indexOf('=');
  if (eq === -1) return;
  env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
});

const DB_HOST = env.DB_HOST || 'localhost';
const DB_PORT = env.DB_PORT || '5432';
const DB_USER = env.DB_USERNAME || 'postgres';
const DB_PASS = env.DB_PASSWORD || 'mtz.123';
const DB_NAME = env.DB_NAME || 'BEST_Managment_System';

const argon2 = require(path.join(__dirname, 'backend-nestjs', 'node_modules', 'argon2'));

async function main() {
  const hashedPassword = await argon2.hash('BenHammouda-Bilel');
  const now = new Date().toISOString();

  const sql = [
    `INSERT INTO public."user" (name, phone, login, password, "createdDate", status, role)`,
    `VALUES (`,
    `  'Ben Hammouda Bilel',`,
    `  52717536,`,
    `  'Ad-Bilel',`,
    `  '${hashedPassword.replace(/'/g, "''")}',`,
    `  '${now}',`,
    `  'Autoriser',`,
    `  'Administrateur'`,
    `)`,
    `ON CONFLICT (login) DO UPDATE`,
    `SET password = EXCLUDED.password,`,
    `    "createdDate" = EXCLUDED."createdDate",`,
    `    name = EXCLUDED.name,`,
    `    phone = EXCLUDED.phone,`,
    `    status = EXCLUDED.status;`,
  ].join('\n');

  const tmpFile = path.join(__dirname, '__seed_user_temp.sql');
  fs.writeFileSync(tmpFile, sql, 'utf-8');

  try {
    execSync(
      `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f "${tmpFile}"`,
      { env: { ...process.env, PGPASSWORD: DB_PASS }, stdio: 'inherit' }
    );
    console.log('  -> Utilisateur administrateur inséré / mis à jour');
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}

main().catch(err => {
  console.error('Erreur seed-user:', err);
  process.exit(1);
});
