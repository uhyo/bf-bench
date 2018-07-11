'use strict';

const {
    main,
} = require('./main.js');

// Read input file name.
const sourceFile = process.argv[2];
// Run the interpreter.
main(sourceFile);
