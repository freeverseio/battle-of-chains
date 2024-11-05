# LAOS Indexer

This code provides an indexer that tracks all NFTs minted on any EVM chain using LAOS Network's bridgeless minting technology.

For example, the indexer can track NFTs created on Ethereum using LAOS. In this scenario, asset ownership and trading remain on Ethereum, while the gas costs for minting are offloaded to the LAOS Network.

In such example, developers using this indexer retrieve NFT data as usual, as if all NFTs were assets regularly created on Ethereum, 
with the use of LAOS being entirely transparent.

The code is a minimal extension of Subsquid's framework, leveraging its multi-chain indexing feature to track events on both the EVM chain and the LAOS Network.

A custom GraphQL API is provided for real-time data retrieval.

## Quickstart

1. **Specify the EVM chain** where bridgeless minting will operate, e.g. Ethereum, Polygon, Base, etc., by creating an `.env` file.
   - Use `example.env` as a reference.
   - Provide the appropriate ownership chain RPC endpoint, e.g. `RPC_ENDPOINT=https://rpc.ankr.com/polygon`.
   - Note: Public RPC endpoints often have transaction limits.

2. **Execute the following commands**:

```bash
# Install @subsquid/cli globally (sqd command)
npm i -g @subsquid/cli@2.12

# Install dependencies
npm ci

# Convert the ABI files to subsquid's .ts representation
sqd typegen

# Clean previous processes
sqd clean:all

# Build and start the processor
sqd run .
```

A GraphQL playground will be available at http://localhost:4350/graphql.


##  GraphQL queries:
`tokens`: Lists NFTs based on the owner's address or a collection address.
`token`: Retrieves current details about a particular NFT.
`transfers`: Shows all transfer events associated with a specific NFT.
`tokenHistory`: Returns all changes associated with the NFT's metadata.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

## License
This project is licensed under the MIT License. 