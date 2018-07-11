'use strict';

/**
 * Cached mapping of correspondence of [ and ].
 */
exports.LoopMap = class {
    constructor(code) {
        this.code = code;
        this.cache = new Map();
    }
    /**
     * Find a corresponding loop end.
     * Also cache the correspondence so that backwards search is enabled.
     */
    findEnd(pc) {
        const { code, cache } = this;
        if (code[pc] !== 0x5b) {
            // pc is not '['
            throw new Error('Invalid instruction');
        }
        // If it is already in the cache, return the value.
        const cached = cache.get(pc);
        if (cached != null) {
            return cached;
        }
        // otherwise, search the source code.
        const codeLen = code.length;
        const stack = [];
        let current_pc = pc + 1;
        while (current_pc < codeLen) {
            const inst = code[current_pc];
            if (inst === 0x5b) {
                // '['
                stack.push(current_pc);
            } else if (inst === 0x5d) {
                // ']'
                // Get the position of corresponding ].
                const start = stack.pop();
                if (start == null) {
                    cache.set(current_pc, pc);
                    cache.set(pc, current_pc);
                    return current_pc;
                } else {
                    cache.set(current_pc, start);
                    cache.set(start, current_pc);
                }
            }
            current_pc++;
        }
        throw new Error('Could not find corrensponding `]`');
    }
    /**
     * Find a corresponding loop start.
     * Cache must be prepared in advance.
     */
    findStart(pc) {
        const { code, cache } = this;
        if (code[pc] !== 0x5d) {
            throw new Error('Invalid instruction');
        }
        const result = cache.get(pc);
        if (result == null) {
            throw new Error('Could not find corresponding `[`');
        }
        return result;
    }
};
