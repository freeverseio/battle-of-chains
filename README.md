# API

## boc-game-engine

API that stitches together the postgraphile read only api + any custom resolver.
It reads the data from the indexers to populate the DB with the approppriate data for the game.

First, run the "update" query.


## boc-game-engine-postgraphile

Connects to postgresql instance and exposes read methods in a graphql api.

### Quickstart

Go to the `docker` folder.

Ensure you have approppriate `.env` file, for local you can copy the `.env.template`. 

Run:

`docker-compose up --build -d`

And that will create a postgresql DB with the schema defined on `boc-game-engine/sql/init.sql` script.

And will expose the postgraphile api on `http://localhost:4001/graphql` and the battle of chains api on `http://localhost:4000/graphql`

To stop and remove all DB/volume: `docker-compose down -v`.


### Regenerate postgresql schema

Run `docker-compose down -v`  This command will stop all the docker containers running, and will delete the postgres volume, allowing you to restart it with a different init sql if you wish to.

# UI

## boc-ui

Frontend that uses boc-game-engine to present relevant data for the users.

### Quickstart

Go to `boc-ui` folder and run:

```
$ npm ci
$ npm run dev
```

# LAOS Indexer

This code provides an indexer that tracks all NFTs minted on any EVM chain using LAOS Network's bridgeless minting technology.

For example, the indexer can track NFTs created on Ethereum using LAOS. In this scenario, asset ownership and trading remain on Ethereum, while the gas costs for minting are offloaded to the LAOS Network.

In such example, developers using this indexer retrieve NFT data as usual, as if all NFTs were assets regularly created on Ethereum, 
with the use of LAOS being entirely transparent.

The code is a minimal extension of Subsquid's framework, leveraging its multi-chain indexing feature to track events on both the EVM chain and the LAOS Network.

A custom GraphQL API is provided for real-time data retrieval.

## Quickstart

Navigate to `boc-indexer`folder and:

1. **Specify the EVM chain** where bridgeless minting will operate, e.g. Ethereum, Polygon, Base, etc., by creating an `.env` file.
   - Use `env.example` as a reference.
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

