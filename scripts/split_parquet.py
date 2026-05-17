import pyarrow.parquet as pq
import pyarrow as pa
import pyarrow.compute as pc
import os

# Create output directory
os.makedirs('public/data', exist_ok=True)

# Read main parquet file
table = pq.read_table('public/bible-points.parquet')
print(f"Total rows: {table.num_rows}")

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
        print(f"Epoch {epoch_id} ({name}): {chunk.num_rows} rows, {size_mb:.2f} MB")