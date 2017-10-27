#!/usr/bin/env node

const Publisher = require('./publisher')

const publisher = new Publisher(process.cwd())

publisher.handle(require('yargs').argv._)
