'use strict';

const {
    OutputBuffer,
} = require('./buf.js');
const {
    LoopMap,
} = require('./loop-map.js');

/**
 * Length of memory.
 */
const MEMORY_LENGTH = 30000;

exports.main = function(code) {
    const codeLength = code.length;

    // Cache of loops.
    const loopMap = new LoopMap(code);
    // Prepare output buffer.
    const output = new OutputBuffer();
    // prepare memory buffer.
    const memory = new Uint8Array(MEMORY_LENGTH);
    // initialize pc and pointer.
    let pc = 0;
    let mem = 0;

    // main loop.
    while (pc < codeLength) {
        const inst = code[pc];
        switch (inst) {
            case 0x2b: {
                // '+'
                memory[mem]++;
                break;
            }
            case 0x2d: {
                // '-'
                memory[mem]--;
                break;
            }
            case 0x3c: {
                // '<'
                if (mem > 0) {
                    mem--;
                } else {
                    throw new Error('Memory pointer out of range');
                }
                break;
            }
            case 0x3e: {
                // '>'
                if (mem < MEMORY_LENGTH - 1) {
                    mem++;
                } else {
                    throw new Error('Memory pointer out of range');
                }
                break;
            }
            case 0x2e: {
                // '.'
                output.write(memory[mem]);
                break;
            }
            case 0x5b: {
                // '['

                // end should always be searched
                // so that backwards cache is enabled.
                const loopEnd = loopMap.findEnd(pc);
                if (memory[mem] === 0) {
                    // skip the loop.
                    pc = loopEnd;
                }
                break;
            }
            case 0x5d: {
                // ']'
                if (memory[mem] !== 0) {
                    // jump back to the loop start.
                    pc = loopMap.findStart(pc);
                }
                break;
            }
            case 0x2c: {
                // ','
                throw new Error('`,` is not supported');
            }
        }
        pc++;
    }
    // Finally, output the result.
    return output.getBuf();
};

