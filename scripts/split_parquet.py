import pyarrow.parquet as pq
import pyarrow as pa
import pyarrow.compute as pc
import os
import sys

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

        # Define epochs based on epoch_id (0-6)
        epochs = {
            0: 'creation',
            1: 'patriarchs', 
            2: 'exodus',
            3: 'kings',
            4: 'exile',
            5: 'intertestamental',
            6: 'gospels'
        }

        total_size = 0
        # Split by epoch_id
        for epoch_id, name in epochs.items():
            mask = pc.equal(table['epoch_id'], epoch_id)
            chunk = table.filter(mask)
            if chunk.num_rows > 0:
                output_path = f'public/data/epoch-{epoch_id}-{name}.parquet'
                pq.write_table(
                    chunk, 
                    output_path,
                    compression='zstd',
                    compression_level=3
                )
                size_mb = os.path.getsize(output_path) / 1024 / 1024
                total_size += size_mb
                print(f"  ✓ Epoch {epoch_id} ({name:20s}): {chunk.num_rows:6,} rows, {size_mb:6.2f} MB")
            else:
                print(f"  - Epoch {epoch_id} ({name:20s}): empty, skipping")
        
        print(f"\n✓ Split complete! Total: {total_size:.2f} MB across {len([e for e in epochs.values() if os.path.exists(f'public/data/epoch-{list(epochs.keys())[list(epochs.values()).index(e)]}-{e}.parquet')])} files")
        return 0
        
    except Exception as e:
        print(f"\n✗ Error during split: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(split_parquet())