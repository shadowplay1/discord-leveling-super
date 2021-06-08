module.exports = class LevelingError extends Error {
    /**
     * Creates an 'LevelingError' error instance.
     * @param {String | Error} message Error message.
     */
    constructor(message) {
        if (message instanceof Error == 'Error') {
            super(message.message)
            Error.captureStackTrace(this, this.constructor)
        }
        if (typeof message == 'string') super(message)
        this.name = 'LevelingError'
    }
}