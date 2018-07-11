'use strict';
const fs = require('fs');
const {
    performance,
} = require('perf_hooks');

const {
    main,
} = require('./main.js');

// Read input file name.
const sourceFile = process.argv[2];
// Number of repeats
const repeat = parseInt(process.argv[3], 10);
// load source code as a Buffer.
const code = fs.readFileSync(sourceFile);


// Run the interpreter.
for (let i=0; i < repeat; i++) {
    const startTime = performance.now();
    main(code);
    const endTime = performance.now();

    const elapsed = Math.floor((endTime - startTime) * 1000000);
    console.log(elapsed);
}
