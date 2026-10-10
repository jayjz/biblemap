import pyarrow.parquet as pq
import pyarrow.compute as pc
import os
import sys
from epochs import EPOCHS, epoch_for_year

def split_parquet():
    try:
        # Create output directory
        os.makedirs('public/data', exist_ok=True)
        print("✓ Output directory ready: public/data")

        # Check if source file exists
        source_path = 'public/bible-points.parquet'
        if not os.path.exists(source_path):
            print(f"✗ Error: Source file not found: {source_path}")
            sys.exit(1)
        
        print(f"→ Reading {source_path}...")
        table = pq.read_table(source_path)
        print(f"✓ Loaded {table.num_rows:,} rows")

        # Validate before writing: unknown IDs or stale year assignments are errors.
        for row in table.select(['epoch_id', 'ussher_year']).to_pylist():
            if row['epoch_id'] != epoch_for_year(row['ussher_year']):
                raise ValueError(f"Epoch/year mismatch: {row}")

        total_size = 0
        # Split by epoch_id
        for epoch in EPOCHS:
            epoch_id, name = epoch["id"], epoch["name"]
            mask = pc.equal(table['epoch_id'], epoch_id)
            chunk = table.filter(mask)
            # Write empty tables too: every manifest path must be fetchable.
            output_path = os.path.join('public/data', epoch['filename'])
            pq.write_table(chunk, output_path, compression='zstd', compression_level=3)
            size_mb = os.path.getsize(output_path) / 1024 / 1024
            total_size += size_mb
            print(f"  ✓ Epoch {epoch_id} ({name}): {chunk.num_rows:,} rows, {size_mb:.2f} MB")

        print(f"\n✓ Split complete! Total: {total_size:.2f} MB across {len(EPOCHS)} files")
        return 0
        
    except Exception as e:
        print(f"\n✗ Error during split: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(split_parquet())