#!/usr/bin/env node
/**
 * Generate the Windows electron-updater `latest.yml` file.
 * This script mirrors the expectations of `scripts/check-release-assets.mjs`:
 *   - version must equal the package version
 *   - path must be the Windows installer filename
 *   - sha512 must be the base64‑encoded SHA‑512 of that installer
 *   - files list must contain a single entry for the installer with the same sha512
 */
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { installerNames } from './release-shape.mjs';

async function main() {
  const directory = resolve(process.argv[2] ?? 'dist');
  // Load version from package.json
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const version = pkg.version;
  // Resolve Windows installer name
  const winInstaller = installerNames(version, 'win32')[0];
  const installerPath = resolve(directory, winInstaller);
  // Compute base64 SHA‑512 of installer
  const data = await readFile(installerPath);
  const sha512 = createHash('sha512').update(data).digest('base64');
  const yaml = `version: ${version}\npath: ${winInstaller}\nsha512: ${sha512}\nfiles:\n  - url: ${winInstaller}\n    sha512: ${sha512}\n`;
  const outPath = resolve(directory, 'latest.yml');
  await writeFile(outPath, yaml, 'utf8');
  console.log(`generated ${outPath}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(err => {
    console.error('generate-latest-yml error:', err);
    process.exit(1);
  });
}
