import { DatabaseType } from '../../../types/databaseType.enum'
import { DiscordID } from '../../../types/misc/utils'
import { typeOf } from '../functions/typeOf.function'

/**
 * Leveling error class.
 * @extends {Error}
 */
export class LevelingError extends Error {

    /**
     * Error code.
     * @type {LevelingErrorCodes}
     */
    public code: LevelingErrorCodes

    /**
     * Leveling error constructor.
     * @param {LevelingErrorCodes} errorCode Error code to throw.
     */
    public constructor(error: LevelingErrorCodes | string, errorCode?: LevelingErrorCodes) {
        const errorMsg: Record<string, any> = errorMessages
        const isErrorCode = errorMsg[error]

        super(isErrorCode ? errorMsg[error] : error)

        /**
         * Error name.
         * @type {string}
         */
        this.name = `LevelingError${isErrorCode
            ? ` [${error}]`
            : errorCode ? ` [${errorCode}]` : ''}`

        /**
         * Error code.
         * @type {LevelingErrorCodes}
         */
        this.code = isErrorCode
            ? error as LevelingErrorCodes
            : errorCode ? errorCode : LevelingErrorCodes.LEVELING_ERROR
    }
}

/**
 * An enum representing the error codes for the Leveling module.
 * @typedef {string} LevelingErrorCodes
 * @prop {string} UNKNOWN_ERROR An unknown error occurred.
 * @prop {string} UNKNOWN_DATABASE The database is unknown or inaccessible.
 * @prop {string} NO_DISCORD_CLIENT No Discord client was provided.
 * @prop {string} DATABASE_ERROR There was an error with the database.
 * @prop {string} LEVELING_ERROR There was an error with the Leveling module.
 * @prop {string} INTENT_MISSING The required intent is missing.
 * @prop {string} REQUIRED_ARGUMENT_MISSING A required argument is missing.
 * @prop {string} REQUIRED_CONFIG_OPTION_MISSING A required configuration option is missing.
 * @prop {string} INVALID_TYPE The type is invalid.
 * @prop {string} INVALID_TARGET_TYPE The target type is invalid.
 * @prop {string} INVALID_TIME The time is invalid.
 * @prop {string} USER_NOT_FOUND User not found.
 * @prop {string} INVALID_INPUT Invalid input.
 */
export enum LevelingErrorCodes {
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    UNKNOWN_DATABASE = 'UNKNOWN_DATABASE',
    NO_DISCORD_CLIENT = 'NO_DISCORD_CLIENT',
    DATABASE_ERROR = 'DATABASE_ERROR',
    LEVELING_ERROR = 'LEVELING_ERROR',
    INTENT_MISSING = 'INTENT_MISSING',
    REQUIRED_ARGUMENT_MISSING = 'REQUIRED_ARGUMENT_MISSING',
    REQUIRED_CONFIG_OPTION_MISSING = 'REQUIRED_CONFIG_OPTION_MISSING',
    INVALID_TYPE = 'INVALID_TYPE',
    INVALID_TARGET_TYPE = 'INVALID_TARGET_TYPE',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    INVALID_INPUT = 'INVALID_INPUT'
}

export const errorMessages = {
    UNKNOWN_ERROR: 'Unknown error.',
    UNKNOWN_DATABASE: 'Unknown database type was specified.',
    NO_DISCORD_CLIENT: 'Discord Client should be specified.',

    DATABASE_ERROR(databaseType: DatabaseType, errorType?: 'malformed' | 'notFound'): string {
        if (databaseType == DatabaseType.JSON) {
            if (errorType == 'malformed') {
                return 'Database file is malformed.'
            }

            if (errorType == 'notFound') {
                return 'Database file path contains unexisting directories.'
            }
        }

        return `Unknown ${databaseType} error.`
    },

    INTENT_MISSING(missingIntent: string): string {
        return `Required intent "${missingIntent}" is missing.`
    },

    INVALID_TYPE<T = any>(parameter: string, requiredType: string, receivedType: T): string {
        return `${parameter} must be a ${requiredType}. Received type: ${typeOf(`${receivedType}`)}.`
    },

    INVALID_TARGET_TYPE<T = any>(requiredType: string, receivedType: T): string {
        return `Target must be ${requiredType.toLowerCase().startsWith('a') ? 'an' : 'a'} ${requiredType}. ` +
            `Received type: ${typeOf(receivedType)}.`
    },

    // `method` parameter should be specified in format: `{ManagerName}.{methodName}`
    REQUIRED_ARGUMENT_MISSING(parameter: string, method: `${string}.${string}`): string {
        return `${parameter} must be specified in '${method}()' method.`
    },

    INVALID_INPUT(parameter: string, method: `${string}.${string}`, issue: string): string {
        return `Invaid value of ${parameter} parameter in ${method} method: ${issue}`
    },

    REQUIRED_CONFIG_OPTION_MISSING(requiredConfigOption: string): string {
        return `Required configuration option "${requiredConfigOption}" is missing.`
    },

    USER_NOT_FOUND<UserID extends string>(userID: DiscordID<UserID>): string {
        return `Specified user with ID ${userID} was not found.`
    }
}
