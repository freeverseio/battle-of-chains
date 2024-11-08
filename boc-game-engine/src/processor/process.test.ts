// src/processor/process.test.ts
import { promises as fs } from 'fs';
import { EventProcessor } from './process';
import { getChains } from './getChains';
import { Storage } from './types';

async function compareStorage(storage: Storage, storageFile: string) {
    const previousStorageData = await fs.readFile(storageFile, 'utf8');
    const previousStorage = JSON.parse(previousStorageData) as Storage;
    const areEqual = JSON.stringify(previousStorage) === JSON.stringify(storage);
    console.log('Storage comparison result:', areEqual ? 'Equal' : 'Different');
    return areEqual;
}

describe('Process and Compare Storage', () => {
    it('should process hardcoded events and compare storage', async () => {
        const debugData = {
            "deadline": 1730728802,
            "useHardcodedEvents": true,
            "eventsFile": './src/processor/test/events01.json',
            "storageFile": './src/processor/test/storage01.json',
        };

        const allChains = await getChains();
        const eventProcessor = new EventProcessor(allChains, debugData);

        await eventProcessor.update();
        const storage = eventProcessor.getStorage();

        const isStorageEqual = await compareStorage(storage, debugData.storageFile);
        if (!isStorageEqual) await fs.writeFile(debugData.storageFile, JSON.stringify(storage, null, 2));
        
        expect(isStorageEqual).toBe(true);
    });
});
