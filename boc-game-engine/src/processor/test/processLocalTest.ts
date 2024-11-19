import { promises as fs } from 'fs';
import { getChains } from '../getChains';
import { EventProcessor } from '../process';
import { DebugData } from '../types';
import { compareStorage } from './testingUtils';

async function test(debugData: DebugData) {
    const allChains = await getChains();
    const eventProcessor = new EventProcessor(allChains, debugData);

    await eventProcessor.update();
    const storage = eventProcessor.getStorage();

    const isStorageEqual = await compareStorage(storage, debugData.storageFile);
    if (!isStorageEqual) {
        console.log('Storage differs. Updating storage file.');
        await fs.writeFile(debugData.storageFile, JSON.stringify(storage, null, 2));
    } else {
        console.log('Storage is the same. No update needed.');
    }
}

async function main() {
    const debugData = {
        "gameStartTime": 1729168020,
        "deadline": 1731402544,
        "useHardcodedEvents": false,
        "eventsFile": './src/processor/test/events02.json',
        "storageFile": './src/processor/test/storage02.json',
    };
    await test(debugData);
}

main().catch(error => {
    console.error('Error during storage processing and comparison:', error);
    process.exit(1);
});
