import type { SpendItem } from '../types';

export function exportToJson(items: SpendItem[]): void {
  const dataStr = JSON.stringify(items, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `ledger-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJson(file: File): Promise<SpendItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsed = JSON.parse(result);
        
        if (!Array.isArray(parsed)) {
          throw new Error('Invalid backup format: Must be an array.');
        }

        // Basic validation
        const isValid = parsed.every(item => 
          item.id && typeof item.id === 'string' &&
          item.name && typeof item.name === 'string' &&
          typeof item.amount === 'number' &&
          item.date && typeof item.date === 'string' &&
          (item.category === 'daily' || item.category === 'big')
        );

        if (!isValid) {
          throw new Error('Invalid backup format: Item structure is incorrect.');
        }

        resolve(parsed as SpendItem[]);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse backup file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
    
    reader.readAsText(file);
  });
}
