import { promises as fs } from 'fs';
import { Storage } from '../types';

export async function compareStorage(storage: Storage, storageFile: string): Promise<boolean> {
    const previousStorageData = await fs.readFile(storageFile, 'utf8');
    const previousStorage = JSON.parse(previousStorageData) as Storage;
    const areEqual = JSON.stringify(previousStorage) === JSON.stringify(storage);
    console.log('Storage comparison result:', areEqual ? 'Equal' : 'Different');
    return areEqual;
}