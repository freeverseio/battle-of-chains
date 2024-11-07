/* eslint-disable no-console */
const express = require('express');
const { postgraphile } = require('postgraphile');
const program = require('commander');
const ConnectionFilterPlugin = require('postgraphile-plugin-connection-filter');
const { version } = require('../package.json');
const NullablePlugin = require('../plugins/NullablePlugin');
program
  .version(version)
  .option('-p, --port <port>', 'server port', '4001')
  .option(
    '-d, --databaseUrl <url>',
    'set the database url',
    'postgres://boc:boc@localhost:5432/boc',
  )
  .parse(process.argv);

const { port, databaseUrl } = program.opts();

console.log('--------------------------------------------------------');
console.log('port              : ', port);
console.log('databaseUrl       : ', databaseUrl);
console.log('--------------------------------------------------------');

const app = express();

app.use(
  postgraphile(databaseUrl, 'public', {
    graphiql: true,
    enhanceGraphiql: true,
    retryOnInitFail: true,
    disableDefaultMutations: true,
    appendPlugins: [
      ConnectionFilterPlugin,
      NullablePlugin,
    ],
    graphileBuildOptions: {
      connectionFilterAllowedOperators: ['equalTo', 'in', 'lessThan', 'greaterThan', 'isNull'],
      connectionFilterArrays: false,
      connectionFilterComputedColumns: false,
      connectionFilterSetofFunctions: false,
    },
  }),
);

app.listen(port);
