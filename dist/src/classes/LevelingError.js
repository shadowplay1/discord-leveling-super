// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

"use strict";
/**
 * LevelingError class.
 */
class LevelingError extends Error {
    /**
     * Creates an 'LevelingError' instance.
     * @param {String | Error} message Error message.
     */
    constructor(message) {
        if (message instanceof Error) {
            super(message.message);
            Error.captureStackTrace(this, this.constructor);
        }
        else
            super(message);
        /**
         * Error name.
         * @type {String}
         */
        this.name = 'LevelingError';
    }
}
module.exports = LevelingError;
