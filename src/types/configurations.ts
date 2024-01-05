import { Mongo, IMongoConnectionOptions } from 'quick-mongo-super/MongoItems'
import Enmap, { EnmapOptions } from 'enmap'

import { DatabaseType } from './databaseType.enum'
import { IDatabaseStructure } from './databaseStructure.interface'

/**
 * Full {@link Leveling} class configuration object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will
 * determine which connection configuration should be used.
 *
 * @typedef {object} ILevelingConfiguration<TDatabaseType>
 * @prop {DatabaseType} database Database type to use.
 * @prop {DatabaseConnectionOptions<TDatabaseType>} connection Database type to use.
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {IUpdateCheckerConfiguration} [updatesChecker] Updates checker configuration.
 * @prop {ILevelingConfigCheckerConfiguration} [configurationChecker] Leveling config checker configuration.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
export type ILevelingConfiguration<TDatabaseType extends DatabaseType> = {

    /**
     * Database type to use.
     * @type {DatabaseType}
     */
    database: TDatabaseType

    /**
     * Database connection options based on the choosen database type.
     * @type {DatabaseConnectionOptions<TDatabaseType>}
     */
    connection: DatabaseConnectionOptions<TDatabaseType>
} & Partial<ILevelingOptionalConfiguration>

/**
 * Optional configuration for the {@link Leveling} class.
 * @typedef {object} ILevelingOptionalConfiguration
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {Partial<IUpdateCheckerConfiguration>} [updatesChecker] Updates checker configuration.
 * @prop {Partial<ILevelingConfigCheckerConfiguration>} [configurationChecker] Leveling config checker configuration.
 */
export interface ILevelingOptionalConfiguration {

    /**
     * Determines if debug mode is enabled.
     * @type {boolean}
     */
    debug: boolean

    /**
     * Updates checker configuration.
     * @type {?IUpdateCheckerConfiguration}
     */
    updatesChecker: Partial<IUpdateCheckerConfiguration>

    /**
     * Leveling config checker configuration.
     * @type {?IUpdateCheckerConfiguration}
     */
    configurationChecker: Partial<ILevelingConfigCheckerConfiguration>
}

/**
 * Configuration for the updates checker.
 * @typedef {object} IUpdateCheckerConfiguration
 * @prop {?boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @prop {?boolean} [upToDateMessage=false] Sends the message in console on start if module is up to date. Default: false.
 */
export type IUpdateCheckerConfiguration = Record<'checkUpdates' | 'upToDateMessage', boolean>

/**
 * Configuration for the configuration checker.
 * @typedef {object} ILevelingConfigCheckerConfiguration
 * @prop {?boolean} ignoreInvalidTypes Allows the method to ignore the options with invalid types. Default: false.
 * @prop {?boolean} ignoreUnspecifiedOptions Allows the method to ignore the unspecified options. Default: true.
 * @prop {?boolean} ignoreInvalidOptions Allows the method to ignore the unexisting options. Default: false.
 * @prop {?boolean} showProblems Allows the method to show all the problems in the console. Default: true.
 * @prop {?boolean} sendLog Allows the method to send the result in the console.
 * Requires the 'showProblems' or 'sendLog' options to set. Default: true.
 * @prop {?boolean} sendSuccessLog Allows the method to send the result if no problems were found. Default: false.
 */
export type ILevelingConfigCheckerConfiguration = Record<
    'ignoreInvalidTypes' | 'ignoreUnspecifiedOptions' | 'ignoreInvalidOptions' |
    'showProblems' | 'sendLog' | 'sendSuccessLog',
    boolean
>

/**
 * JSON database configuration.
 * @typedef {object} IJSONDatabaseConfiguration
 * @prop {?string} [path='./leveling.json'] Full path to a JSON storage file. Default: './leveling.json'.
 * @prop {?boolean} [checkDatabase=true] Enables the error checking for database file. Default: true
 * @prop {?number} [checkingCountdown=1000] Determines how often the database file will be checked (in ms). Default: 1000.
 */
export interface IJSONDatabaseConfiguration {

    /**
     * Full path to a JSON storage file. Default: './leveling.json'.
     * @type {string}
     */
    path: string

    /**
     * Minifies the JSON content in database file to save some space.
     * @type {boolean}
     */
    minifyJSON: boolean

    /**
     * Enables the error checking for database file. Default: true
     * @type {boolean}
     */
    checkDatabase: boolean

    /**
     * Determines how often the database file will be checked (in ms). Default: 1000.
     * @type {number}
     */
    checkingInterval: number
}

/**
 * Database connection options based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will
 * determine which connection configuration should be used.
 *
 * @typedef {(
 * Partial<IJSONDatabaseConfiguration> | EnmapOptions<any, any> | IMongoConnectionOptions
 * )} DatabaseConnectionOptions<TDatabaseType>
 *
 * @see Partial<IJSONDatabaseConfiguration> - JSON configuration.
 *
 * @see EnmapOptions<any, any> - Enmap configuration.
 *
 * @see IMongoConnectionOptions - MongoDB connection configuration.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
export type DatabaseConnectionOptions<TDatabaseType extends DatabaseType> =
    TDatabaseType extends DatabaseType.JSON ? Partial<IJSONDatabaseConfiguration> :
    TDatabaseType extends DatabaseType.ENMAP ? EnmapOptions<any, any> :
    TDatabaseType extends DatabaseType.MONGODB ? IMongoConnectionOptions : never

/**
 * External database object based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will determine
 * which connection configuration should be used.
 * - `TKey` ({@link string}) - The type of database key that will be used
 * - `TValue` ({@link any}) - The type of database values that will be used
 *
 * @typedef {(
 * null | Enmap<string, IDatabaseStructure> | Mongo<IDatabaseStructure>
 * )} Database<TDatabaseType>
 *
 * @see null - JSON database management object - `null`
 * is because it's not an external database - JSON is being parsed by the module itself.
 *
 * @see Enmap<string, IDatabaseStructure> - Enmap database.
 *
 * @see Mongo<IDatabaseStructure> - MongoDB database.
 *
 * @template TDatabaseType
 * The database type that will determine which external database management object should be used.
 * @template TKey The type of database key that will be used.
 * @template TValue The type of database values that will be used.
 */
export type Database<
    TDatabaseType extends DatabaseType,
    TKey extends string = `${string}.leveling`,
    TValue = IDatabaseStructure
> =
    TDatabaseType extends DatabaseType.JSON ? null :
    TDatabaseType extends DatabaseType.ENMAP ? Enmap<TKey, TValue> :
    TDatabaseType extends DatabaseType.MONGODB ? Mongo<TKey, TValue, false> : never
