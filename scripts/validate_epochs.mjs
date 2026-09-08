export function validateManifest(manifest) {
  if (manifest.schemaVersion !== 1 || manifest.chronology !== 'ussher' || !Array.isArray(manifest.epochs) || !manifest.epochs.length) {
    throw new Error('Invalid epoch manifest header');
  }
  const ids = new Set(), filenames = new Set(), hashes = new Set();
  let previous = -Infinity;
  manifest.epochs.forEach((epoch, index) => {
    if (!Number.isInteger(epoch.id) || epoch.id < 0 || ids.has(epoch.id)) throw new Error('Duplicate or invalid epoch ID');
    if (!/^epoch-\d+-[a-z-]+\.parquet$/.test(epoch.filename) || filenames.has(epoch.filename)) throw new Error('Invalid or duplicate filename');
    if (!epoch.filename.startsWith(`epoch-${epoch.id}-`)) throw new Error('Filename ID mismatch');
    if (!/^#[a-z]+$/.test(epoch.hash) || hashes.has(epoch.hash) || !epoch.name || !epoch.description) throw new Error('Invalid UI metadata');
    const end = epoch.endYearInclusive;
    if (index === manifest.epochs.length - 1 ? end !== null : !Number.isFinite(end) || end <= previous) throw new Error('Invalid epoch boundaries');
    ids.add(epoch.id); filenames.add(epoch.filename); hashes.add(epoch.hash);
    previous = end;
  });
}

export function epochForYear(manifest, year) {
  if (typeof year !== 'number' || !Number.isFinite(year)) throw new Error('Year must be finite');
  return manifest.epochs.find(epoch => epoch.endYearInclusive === null || year <= epoch.endYearInclusive).id;
}

export function validateRows(manifest, expectedId, rows) {
  if (!manifest.epochs.some(epoch => epoch.id === expectedId)) throw new Error('Unknown epoch ID');
  let index = 0;
  for (const row of rows) {
    const id = typeof row.epoch_id === 'bigint' ? Number(row.epoch_id) : row.epoch_id;
    if (id !== expectedId || epochForYear(manifest, row.ussher_year) !== id) {
      throw new Error(`Epoch ${expectedId}, row ${index}: ID/year assignment mismatch`);
    }
    index++;
  }
}
