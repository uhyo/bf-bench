'use strict';

/**
 * Initial length of buffer.
 */
const BUF_INIT_LEN = 1024;

/**
 * Output buffer.
 */
exports.OutputBuffer = class OutputBuffer {
    constructor() {
        /**
         * Actual buffer.
         */
        this.buf = new Uint8Array(BUF_INIT_LEN);
        /**
         * Current index of cursor.
         */
        this.cursor = 0;
    }
    /**
     * Write a byte to the buffer.
     */
    write(chr) {
        if (this.cursor + 1 === this.buf.length) {
            this.expandBuf();
        }
        this.buf[this.cursor] = chr;
        this.cursor++;
    }
    /**
     * Expand the length of buffer.
     * @internal
     */
    expandBuf() {
        const newbuf = new Uint8Array(this.buf.length * 2);
        newbuf.set(this.buf);
        this.buf = newbuf;
    }
    /**
     * Get a reference to the internal buffer.
     */
    getBuf() {
        return Buffer.from(this.buf.buffer, 0, this.cursor);
    }
}
