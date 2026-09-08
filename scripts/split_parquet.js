// Validate committed chunks; generating them remains a separate Python ETL step.
import { readFileSync, readdirSync } from 'node:fs';
import init, { readParquet } from 'parquet-wasm/esm';
import { tableFromIPC } from 'apache-arrow';
import { validateManifest, validateRows } from './validate_epochs.mjs';

const manifest = JSON.parse(readFileSync(new URL('../src/domain/epochs.json', import.meta.url), 'utf8'));
validateManifest(manifest);
await init({ module_or_path: readFileSync(new URL('../node_modules/parquet-wasm/esm/parquet_wasm_bg.wasm', import.meta.url)) });
const dataDir = new URL('../public/data/', import.meta.url);
const expected = new Set(manifest.epochs.map(epoch => epoch.filename));
const unexpected = readdirSync(dataDir).filter(name => name.endsWith('.parquet') && !expected.has(name));
if (unexpected.length) throw new Error(`Unmanifested chunks: ${unexpected.join(', ')}`);
let total = 0;
for (const epoch of manifest.epochs) {
  const table = tableFromIPC(readParquet(readFileSync(new URL(epoch.filename, dataDir))).intoIPCStream());
  for (const name of ['epoch_id', 'ussher_year', 'name', 'description', 'event_type', 'lon', 'lat', 'verse_text_snippet', 'verse_reference', 'primary_book']) {
    if (!table.getChild(name)) throw new Error(`${epoch.filename}: missing column ${name}`);
  }
  validateRows(manifest, epoch.id, table);
  total += table.numRows;
  console.log(`✓ ${epoch.filename}: ${table.numRows} rows (${epoch.name})`);
}
console.log(`✓ Validated ${manifest.epochs.length} chunks, ${total} rows`);
