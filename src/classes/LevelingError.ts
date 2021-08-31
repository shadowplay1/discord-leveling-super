/**
 * LevelingError class.
 */
class LevelingError extends Error {

    /**
     * Creates an 'LevelingError' instance.
     * @param {String | Error} message Error message.
     */
    constructor(message?: any) {
        if (message instanceof Error) {
            super(message.message)
            Error.captureStackTrace(this, this.constructor)
        }
        else super(message)

        /**
         * Error name.
         * @type {String}
         */
        this.name = 'LevelingError'
    }
}

export = LevelingError