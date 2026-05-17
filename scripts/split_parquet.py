import pyarrow.parquet as pq
import pyarrow as pa
import pyarrow.compute as pc
import os

# Read main file
table = pq.read_table('public/bible-points.parquet')

# Define epoch mappings based on DataLoader.tsx EPOCHS array
epochs = {
    'creation': 0,      # Creation & Patriarchs
    'exodus': 1,        # Exodus & Conquest
    'kings': 2,         # Judges & Kings
    'exile': 3,         # Exile & Return
    'intertestamental': 4,  # Intertestamental
    'gospels': 5,       # Jesus & Early Church
}

# Ensure output directory exists
os.makedirs('public/data', exist_ok=True)

for epoch_name, epoch_id in epochs.items():
    # Filter by epoch_id
    mask = pc.equal(table['epoch_id'], epoch_id)
    chunk = table.filter(mask)
    
    output_path = f'public/data/{epoch_name}.parquet'
    pq.write_table(chunk, output_path)
    print(f"Created {output_path} with {len(chunk)} rows")

print("\nChunking complete!")
print(f"Original file: {len(table)} rows")
for epoch_name in epochs.keys():
    chunk_table = pq.read_table(f'public/data/{epoch_name}.parquet')
    print(f"  {epoch_name}: {len(chunk_table)} rows")