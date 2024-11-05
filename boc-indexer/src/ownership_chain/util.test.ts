import { createHash } from 'crypto';
import { v5 as uuidv5 } from 'uuid';
import { generateAssetUUID, parseBaseURI } from './util';



describe('generateUUID', () => {
  it('should combine tokenId and contractAddress and generate a UUID', () => {
    const tokenId = "73650113464448320614314146005078575017174739311147380597791116992882814864680";
    const contractAddress = '0xfec1af3e023432ef364ef88653094442cfc00020';
    expect(generateAssetUUID(tokenId, contractAddress)).toBe('eb86bf56-9060-5369-8314-447743cfb20b');
    expect(generateAssetUUID(tokenId, contractAddress)).toBe('eb86bf56-9060-5369-8314-447743cfb20b');


  });

  it('should combine tokenId and contractAddress and generate a UUID', () => {
    const tokenId = "860693765837880643717743864570872188823830693415160471676824633488737684776";
    const contractAddress = '0xfec1af3e023432ef364ef88653094442cfc00020';
    expect(generateAssetUUID(tokenId, contractAddress)).toBe('5258bdfa-3b2e-58c7-a686-17d1e8406586');
    expect(generateAssetUUID(tokenId, contractAddress)).toBe('5258bdfa-3b2e-58c7-a686-17d1e8406586');

    
  });
});



describe('parseBaseURI', () => {
    beforeAll(() => {
        // Mock environment variables
        process.env.LAOS_GLOBAL_CONSENSUS = '0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f';
        process.env.LAOS_PARACHAIN = '4006';
        process.env.LAOS_PALLET_INSTANCE = '51';
    });

    it('should parse a valid baseUri and return the expected structure', () => {
        const baseUri = 'https://uloc.io/GlobalConsensus(0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f)/Parachain(4006)/PalletInstance(51)/AccountKey20(0xfFfFffffffFFFFFFFfFFFFfE000000000000007a)/';
        const result = parseBaseURI(baseUri);

        expect(result).toEqual({
            globalConsensus: 'GlobalConsensus(0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f)',
            parachain: 'Parachain(4006)',
            palletInstance: 'PalletInstance(51)',
            accountKey20: '0xfFfFffffffFFFFFFFfFFFFfE000000000000007a',
            generalKey: null,
            ulocPrefix: 'GlobalConsensus(0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f)/Parachain(4006)/PalletInstance(51)/',
        });
    });

    it('should return null for an invalid baseUri', () => {
        const baseUri = 'https://uloc.io/InvalidData/Parachain(2)/PalletInstance(3)/AccountKey20(0x123abc)';
        const result = parseBaseURI(baseUri);

        expect(result).toBeNull();
    });
});
