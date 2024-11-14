// src/processor/process.test.ts
import { promises as fs } from 'fs';
import { EventProcessor } from './process';
import { getChains } from './getChains';
import { compareStorage } from './test/testingUtils';

describe('Process and Compare Storage', () => {
    it('should process hardcoded events and compare storage for test suite 1', async () => {
        const debugData = {
            "gameStartTime": 1729168020,
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

    it('should process hardcoded events and compare storage for test suite 2', async () => {
        const debugData = {
            "gameStartTime": 1729168020,
            "deadline": 1731402544,
            "useHardcodedEvents": true,
            "eventsFile": './src/processor/test/events02.json',
            "storageFile": './src/processor/test/storage02.json',
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
