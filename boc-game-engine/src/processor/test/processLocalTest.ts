// Save this as processAndCompareStorage.ts
import { promises as fs } from 'fs';
import { getChains } from '../getChains';
import { EventProcessor } from '../process';
import { DebugData, Storage } from '../types';
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

async function testHardcodedEvents() {
    const debugData = {
        "gameStartTime": 1729168020,
        "deadline": 1731402544,
        "useHardcodedEvents": true,
        "eventsFile": './src/processor/test/events02.json',
        "storageFile": './src/processor/test/storage02.json',
    };
    await test(debugData);
}

async function testRealTimeEvents() {
    const allChains = await getChains();
    const eventProcessor = new EventProcessor(allChains, undefined);

    await eventProcessor.update();
    const storage = eventProcessor.getStorage();

    const storageFile = './src/processor/test/storage02.json';
    const isStorageEqual = await compareStorage(storage, storageFile);
    if (!isStorageEqual) {
        console.log('Storage differs. Updating storage file.');
        await fs.writeFile(storageFile, JSON.stringify(storage, null, 2));
    } else {
        console.log('Storage is the same. No update needed.');
    }
}

async function main() {
    await testHardcodedEvents();
    // await testRealTimeEvents();
}

main().catch(error => {
    console.error('Error during storage processing and comparison:', error);
    process.exit(1);
});
