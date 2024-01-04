import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { ms } from './lib/misc/ms'

import QuickMongo from 'quick-mongo-super'
import Enmap from 'enmap'

import {
    Client, GatewayIntentBits,
    GuildMember,
    IntentsBitField, TextChannel, User
} from 'discord.js'

import {
    Database, DatabaseConnectionOptions,
    ILevelingConfiguration
} from './types/configurations'

import { ILevelingEvents } from './types/levelingEvents.interface'

import { DatabaseType } from './types/databaseType.enum'
import { checkUpdates } from './lib/util/functions/checkUpdates.function'

import { version as packageVersion } from '../package.json'

import { LevelingError, LevelingErrorCodes, errorMessages } from './lib/util/classes/LevelingError'

import { Logger } from './lib/util/classes/Logger'
import { Emitter } from './lib/util/classes/Emitter'

import { DatabaseManager } from './lib/managers/DatabaseManager'

import { checkConfiguration } from './lib/util/functions/checkConfiguration.function'
import { IDatabaseStructure } from './types/databaseStructure.interface'

/**
 * Main Leveling class.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @extends {Emitter<ILevelingEvents<TDatabaseType>>}
 * @template TDatabaseType The database type that will be used in the module.
 */
export class Leveling<
    TDatabaseType extends DatabaseType,
    TDatabaseKey extends string = `${string}.leveling`,
    TDatabaseValue = IDatabaseStructure
> extends Emitter<ILevelingEvents<TDatabaseType>> {

    /**
     * Discord Client.
     * @type {Client<boolean>}
     */
    public readonly client: Client<boolean>

    /**
     * {@link Leveling} ready state.
     * @type {boolean}
     */
    public ready: boolean

    /**
     * {@link Leveling} version.
     * @type {string}
     */
    public readonly version: string

    /**
     * Completed, filled and fixed {@link Leveling} configuration.
     * @type {Required<ILevelingConfiguration<DatabaseType>>}
     */
    public readonly options: Required<ILevelingConfiguration<TDatabaseType>>

    /**
     * External database instanca (such as Enmap or MongoDB) if used.
     * @type {?Database<DatabaseType>}
     */
    public db: Database<TDatabaseType, TDatabaseKey, TDatabaseValue>

    /**
     * Database Manager.
     * @type {DatabaseManager}
     */
    public database: DatabaseManager<TDatabaseType, any, TDatabaseValue>

    /**
     * Leveling logger.
     * @type {Logger}
     * @private
     */
    private readonly _logger: Logger

    /**
     * Leveling ending state checking interval.
     * @type {NodeJS.Timeout}
     */
    public levelingCheckingInterval: NodeJS.Timeout

    /**
     * Main {@link Leveling} constructor.
     * @param {Client} client Discord client.
     * @param {ILevelingConfiguration<TDatabaseType>} options {@link Leveling} configuration.
     */
    public constructor(client: Client<boolean>, options: ILevelingConfiguration<TDatabaseType>) {
        super()

        /**
         * Discord Client.
         * @type {Client}
         */
        this.client = client

        /**
         * {@link Leveling} ready state.
         * @type {boolean}
         */
        this.ready = false

        /**
         * {@link Leveling} version.
         * @type {string}
         */
        this.version = packageVersion

        /**
         * {@link Leveling} logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger(options.debug || false)

        this._logger.debug('Leveling version: ' + this.version, 'lightcyan')
        this._logger.debug(`Database type is ${options.database}.`, 'lightcyan')
        this._logger.debug('Debug mode is enabled.', 'lightcyan')

        this._logger.debug('Checking the configuration...')

        /**
         * Completed, filled and fixed {@link Leveling} configuration.
         * @type {Required<ILevelingConfiguration<TDatabaseType>>}
         */
        this.options = checkConfiguration<TDatabaseType>(options, options.configurationChecker)

        /**
         * External database instance (such as Enmap or MongoDB) if used.
         * @type {?Database<TDatabaseType>}
         */
        this.db = null as any // specifying 'null' to just initialize the property; for docs purposes

        /**
         * Database Manager.
         * @type {DatabaseManager<TDatabaseType, TDatabaseKey, TDatabaseValue>}
         */
        this.database = null as any // specifying 'null' to just initialize the property; for docs purposes

        /**
         * {@link Leveling} ending state checking interval.
         * @type {NodeJS.Timeout}
         */
        this.levelingCheckingInterval = null as any // specifying 'null' to just initialize the property; for docs purposes

        this._init()
    }

    /**
     * Initialize the database connection and initialize the {@link Leveling} module.
     * @returns {Promise<void>}
     * @private
     */
    private async _init(): Promise<void> {
        this._logger.debug('Leveling starting process launched.', 'lightgreen')

        if (!this.client) {
            throw new LevelingError(LevelingErrorCodes.NO_DISCORD_CLIENT)
        }

        if (!this.options.database) {
            throw new LevelingError(
                errorMessages.REQUIRED_CONFIG_OPTION_MISSING('database'),
                LevelingErrorCodes.REQUIRED_CONFIG_OPTION_MISSING
            )
        }

        if (!this.options.connection) {
            throw new LevelingError(
                errorMessages.REQUIRED_CONFIG_OPTION_MISSING('connection'),
                LevelingErrorCodes.REQUIRED_CONFIG_OPTION_MISSING
            )
        }

        const isDatabaseCorrect = Object.keys(DatabaseType)
            .map(databaseType => databaseType.toLowerCase())
            .includes(this.options.database.toLowerCase())

        if (!isDatabaseCorrect) {
            throw new LevelingError(
                errorMessages.INVALID_TYPE(
                    '"database"',
                    'value from "DatabaseType" enum: either "JSON", "MONGODB" or "Enmap"',
                    typeof this.options.database
                ),
                LevelingErrorCodes.INVALID_TYPE
            )
        }

        if (typeof this.options.connection !== 'object') {
            throw new LevelingError(
                errorMessages.INVALID_TYPE('connection', 'object', typeof this.options.connection),
                LevelingErrorCodes.INVALID_TYPE
            )
        }

        const requiredIntents: GatewayIntentBits[] = [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions
        ]

        const clientIntents = new IntentsBitField(this.client.options.intents)

        for (const requiredIntent of requiredIntents) {
            if (!clientIntents.has(requiredIntent)) {
                throw new LevelingError(
                    errorMessages.INTENT_MISSING(GatewayIntentBits[requiredIntent]),
                    LevelingErrorCodes.INTENT_MISSING
                )
            }
        }

        switch (this.options.database) {
            case DatabaseType.JSON: {
                this._logger.debug('Checking the database file...')

                const databaseOptions = this.options.connection as Required<DatabaseConnectionOptions<DatabaseType.JSON>>
                const isFileExists = existsSync(databaseOptions.path as string)

                if (!isFileExists) {
                    await writeFile(databaseOptions.path as string, '{}')
                }

                if (databaseOptions.checkDatabase) {
                    try {
                        setInterval(async () => {
                            const isFileExists = existsSync(databaseOptions.path as string)

                            if (!isFileExists) {
                                await writeFile(databaseOptions.path as string, '{}')
                            }

                            const databaseFile = await readFile(databaseOptions.path as string, 'utf-8')
                            JSON.parse(databaseFile)
                        }, databaseOptions.checkingInterval)
                    } catch (err: any) {
                        if (err.message.includes('Unexpected token') || err.message.includes('Unexpected end')) {
                            throw new LevelingError(
                                errorMessages.DATABASE_ERROR(DatabaseType.JSON, 'malformed'),
                                LevelingErrorCodes.DATABASE_ERROR
                            )
                        }

                        if (err.message.includes('no such file')) {
                            throw new LevelingError(
                                errorMessages.DATABASE_ERROR(DatabaseType.JSON, 'notFound'),
                                LevelingErrorCodes.DATABASE_ERROR
                            )
                        }

                        throw new LevelingError(
                            errorMessages.DATABASE_ERROR(DatabaseType.JSON),
                            LevelingErrorCodes.DATABASE_ERROR
                        )
                    }
                }

                this.emit('databaseConnect')
                break
            }

            case DatabaseType.MONGODB: {
                this._logger.debug('Connecting to MongoDB...')

                const databaseOptions = this.options.connection as DatabaseConnectionOptions<DatabaseType.MONGODB>

                const mongo = new QuickMongo<any, any, any>(databaseOptions)
                const connectionStartDate = Date.now()

                await mongo.connect()

                this.db = mongo as Database<TDatabaseType, TDatabaseKey, TDatabaseValue>
                this._logger.debug(`MongoDB connection established in ${Date.now() - connectionStartDate}ms`, 'lightgreen')

                this.emit('databaseConnect')
                break
            }

            case DatabaseType.ENMAP: {
                this._logger.debug('Initializing Enmap...')

                const databaseOptions = this.options.connection as DatabaseConnectionOptions<DatabaseType.ENMAP>
                this.db = new Enmap(databaseOptions) as Database<TDatabaseType, TDatabaseKey, TDatabaseValue>

                this.emit('databaseConnect')
                break
            }

            default: {
                throw new LevelingError(LevelingErrorCodes.UNKNOWN_DATABASE)
            }
        }

        this.database = new DatabaseManager<TDatabaseType, TDatabaseKey, TDatabaseValue>(this)
        await this._sendUpdateMessage()

        this._logger.debug('Waiting for client to be ready...')

        const clientReadyInterval = setInterval(() => {
            if (this.client.isReady()) {
                clearInterval(clientReadyInterval)

                const giveawatCheckingInterval = setInterval(() => {
                    this._checkLeveling()
                }, this.options.levelingCheckingInterval)

                this.levelingCheckingInterval = giveawatCheckingInterval

                this.ready = true
                this.emit('ready', this)

                this._logger.debug('Leveling module is ready!', 'lightgreen')
            }
        }, 100)
    }

    /**
     * Sends the {@link Leveling} module update state in the console.
     * @returns {Promise<void>}
     * @private
     */
    private async _sendUpdateMessage(): Promise<void> {
        /* eslint-disable max-len */
        if (this.options.updatesChecker?.checkUpdates) {
            const result = await checkUpdates()

            if (!result.updated) {
                console.log('\n\n')
                console.log(this._logger.colors.green + '╔═════════════════════════════════════════════════════════════════════╗')
                console.log(this._logger.colors.green + '║ @ discord-leveling-super                                    - [] X ║')
                console.log(this._logger.colors.green + '║═════════════════════════════════════════════════════════════════════║')
                console.log(this._logger.colors.yellow + `║                      The module is ${this._logger.colors.red}out of date!${this._logger.colors.yellow}                     ║`)
                console.log(this._logger.colors.magenta + '║                       New version is available!                     ║')
                console.log(this._logger.colors.blue + `║                             ${result.installedVersion} --> ${result.availableVersion}                         ║`)
                console.log(this._logger.colors.cyan + '║                Run "npm i discord-leveling-super@latest"           ║')
                console.log(this._logger.colors.cyan + '║                              to update!                             ║')
                console.log(this._logger.colors.white + '║                     View the full changelog here:                   ║')
                console.log(this._logger.colors.red + `║     https://dgs-docs.js.org/#/docs/main/${result.availableVersion}/general/changelog     ║`)
                console.log(this._logger.colors.green + '╚═════════════════════════════════════════════════════════════════════╝\x1b[37m')
                console.log('\n\n')
            } else {
                if (this.options.updatesChecker?.upToDateMessage) {
                    console.log('\n\n')
                    console.log(this._logger.colors.green + '╔═════════════════════════════════════════════════════════════════╗')
                    console.log(this._logger.colors.green + '║ @ discord-leveling-super                                - [] X ║')
                    console.log(this._logger.colors.green + '║═════════════════════════════════════════════════════════════════║')
                    console.log(this._logger.colors.yellow + `║                      The module is ${this._logger.colors.cyan}up to date!${this._logger.colors.yellow}                  ║`)
                    console.log(this._logger.colors.magenta + '║                      No updates are available.                  ║')
                    console.log(this._logger.colors.blue + `║                      Current version is ${result.availableVersion}.                  ║`)
                    console.log(this._logger.colors.cyan + '║                               Enjoy!                            ║')
                    console.log(this._logger.colors.white + '║                   View the full changelog here:                 ║')
                    console.log(this._logger.colors.red + `║   https://dgs-docs.js.org/#/docs/main/${result.availableVersion}/general/changelog   ║`)
                    console.log(this._logger.colors.green + '╚═════════════════════════════════════════════════════════════════╝\x1b[37m')
                    console.log('\n\n')
                }
            }
        }
    }

}


// For documentation purposes

/**
 * Full {@link Leveling} class configuration object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will
 * determine which connection configuration should be used.
 *
 * @typedef {object} ILevelingConfiguration<TDatabaseType>
 * @prop {DatabaseType} database Database type to use.
 * @prop {DatabaseConnectionOptions} connection Database type to use.
 *
 * @prop {?number} [levelingCheckingInterval=1000]
 * Determines how often the leveling ending state will be checked (in ms). Default: 1000.
 *
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {Partial} [updatesChecker] Updates checker configuration.
 * @prop {Partial} [configurationChecker] Leveling config checker configuration.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */

/**
 * Optional configuration for the {@link Leveling} class.
 * @typedef {object} ILevelingOptionalConfiguration
 *
 * @prop {?number} [levelingCheckingInterval=1000]
 * Determines how often the leveling ending state will be checked (in ms). Default: 1000.
 *
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {Partial} [updatesChecker] Updates checker configuration.
 * @prop {Partial} [configurationChecker] Leveling config checker configuration.
 */

/**
 * Configuration for the updates checker.
 * @typedef {object} IUpdateCheckerConfiguration
 * @prop {?boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @prop {?boolean} [upToDateMessage=false] Sends the message in console on start if module is up to date. Default: false.
 */

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

/**
 * JSON database configuration.
 * @typedef {object} IJSONDatabaseConfiguration
 * @prop {?string} [path='./leveling.json'] Full path to a JSON storage file. Default: './leveling.json'.
 * @prop {?boolean} [checkDatabase=true] Enables the error checking for database file. Default: true
 * @prop {?number} [checkingInterval=1000] Determines how often the database file will be checked (in ms). Default: 1000.
 */

/**
 * JSON database configuration.
 * @typedef {object} IJSONDatabaseConfiguration
 * @prop {?string} [path='./leveling.json'] Full path to a JSON storage file. Default: './leveling.json'.
 * @prop {?boolean} [checkDatabase=true] Enables the error checking for database file. Default: true
 * @prop {?number} [checkingInterval=1000] Determines how often the database file will be checked (in ms). Default: 1000.
 */

/**
 * Database connection options based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will
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

/**
 * External database object based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will determine
 * which connection configuration should be used.
 *
 * - `TKey` ({@link string}) - The type of database key that will be used.
 * - `TValue` ({@link any}) - The type of database values that will be used.
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


/**
 * An interface containing the structure of the database used in the ILeveling class.
 * @typedef {object} IDatabaseStructure
 * [FILL IN]
 */

/**
 * A type containing all the {@link Leveling} events and their return types.
 * [FILL IN]
 */

/**
 * An interface containing different colors that may be used in a logger.
 * @typedef {object} ILoggerColors
 * @prop {string} red The color red.
 * @prop {string} green The color green.
 * @prop {string} yellow The color yellow.
 * @prop {string} blue The color blue.
 * @prop {string} magenta The color magenta.
 * @prop {string} cyan The color cyan.
 * @prop {string} white The color white.
 * @prop {string} reset The reset color.
 * @prop {string} black The color black.
 * @prop {string} lightgray The color light gray.
 * @prop {string} default The default color.
 * @prop {string} darkgray The color dark gray.
 * @prop {string} lightred The color light red.
 * @prop {string} lightgreen The color light green.
 * @prop {string} lightyellow The color light yellow.
 * @prop {string} lightblue The color light blue.
 * @prop {string} lightmagenta The color light magenta.
 * @prop {string} lightcyan The color light cyan.
 */

/**
 * An object containing the data about available module updates.
 * @typedef {object} IUpdateState
 * @prop {boolean} updated Whether an update is available or not.
 * @prop {string} installedVersion The currently installed version.
 * @prop {string} availableVersion The available version, if any.
 */



// Utility types

/**
 * Represents the `if` statement on a type level.
 *
 * Type parameters:
 *
 * - `T` ({@link boolean}) - The boolean type to compare with.
 * - `IfTrue` ({@link any}) - The type that will be returned if `T` is `true`.
 * - `IfFalse` ({@link any}) - The type that will be returned if `T` is `false`.
 *
 * @typedef {IfTrue | IfFalse} If<T, IfTrue, IfFalse>
 *
 * @template T The boolean type to compare with.
 * @template IfTrue The type that will be returned if `T` is `true`.
 * @template IfFalse The type that will be returned if `T` is `false`.
 */

/**
 * Makes the specified properties in `K` from the object in `T` optional.
 *
 * Type parameters:
 *
 * - `T` ({@link object}) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make optional.
 *
 * @typedef {object} OptionalProps<T, K>
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make optional.
 */

/**
 * Makes the specified properties in `K` from the object in `T` required.
 *
 * Type parameters:
 *
 * - `T` ({@link object}) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make required.
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make required.
 *
 * @typedef {object} RequiredProps
 */

/**
 * A callback function that calls when finding an element in array.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type of item to be passed to the callback function.
 *
 * @callback FindCallback<T>
 * @template T The type of item to be passed to the callback function.
 *
 * @param {T} item The item to be passed to the callback function.
 * @returns {boolean} The boolean value returned by the callback function.
 */

/**
 * A callback function that calls when mapping the array using the {@link Array.prototype.map} method.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type of item to be passed to the callback function.
 * - `TReturnType` - ({@link any}) The type of value returned by the callback function.
 *
 * @callback MapCallback<T, TReturnType>
 *
 * @template T The type of item to be passed to the callback function.
 * @template TReturnType The type of value returned by the callback function.
 *
 * @param {T} item The item to be passed to the callback function.
 * @returns {TReturnType} The value returned by the callback function.
 */

/**
 * A type that represents any value with "null" possible to be returned.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type to attach.
 *
 * @template T The type to attach.
 * @typedef {any} Maybe<T>
 */

/**
 * Adds a prefix at the beginning of a string literal type.
 *
 * Type parameters:
 *
 * - `TWord` ({@link string}) The string literal type or union type of them to add the prefix to.
 * - `TPrefix` ({@link string}) The string literal type of the prefix to use.
 *
 * @template TWord The string literal type or union type of them to add the prefix to.
 * @template TPrefix The string literal type of the prefix to use.
 *
 * @typedef {string} AddPrefix<TWord, TPrefix>
 */

/**
* Constructs an object type with prefixed properties and specified value for each of them.
*
* Type parameters:
*
* - `TWords` ({@link string}) The union type of string literals to add the prefix to.
* - `TPrefix` ({@link string}) The string literal type of the prefix to use.
* - `Value` ({@link any}) Any value to assign as value of each property of the constructed object.
*
* @template TWords The union type of string literals to add the prefix to.
* @template TPrefix The string literal type of the prefix to use.
* @template Value Any value to assign as value of each property of the constructed object.
*
* @typedef {string} PrefixedObject<TWords, TPrefix, Value>
*/

/**
 * Compares the values on type level and returns a boolean value.
 *
 * Type parameters:
 *
 * - `ToCompare` ({@link any}) - The type to compare.
 * - `CompareWith` ({@link any}) - The type to compare with.
 *
 * @template ToCompare The type to compare.
 * @template CompareWith The type to compare with.
 *
 * @typedef {boolean} Equals<ToCompare, CompareWith>
 */


/**
 * Returns a length of a string on type level.
 *
 * Type parameters:
 *
 * - `S` ({@link string}) - The string to check the length of.
 *
 * @template S The string to check the length of.
 * @typedef {number} StringLength<S>
 */

/**
* Conditional type that will return the specified string if it matches the specified length.
*
* Type parameters:
*
* - `N` ({@link number}) - The string length to match to.
* - `S` ({@link string}) - The string to check the length of.
*
* @template N The string length to match to.
* @template S The string to check the length of.
*
* @typedef {number} ExactLengthString<N, S>
*/

/**
* Conditional type that will return the specified string if it matches any of the possible Discord ID string lengths.
*
* Type parameters:
*
* - `S` ({@link string}) - The string to check the length of.
*
* @template S The string to check the length of.
* @typedef {number} DiscordID<ID>
*/

/**
 * Extracts the type that was passed into `Promise<...>` type.
 *
 * Type parameters:
 *
 * - `P` ({@link Promise<any>}) - The Promise to extract the type from.
 *
 * @template P The Promise to extract the type from.
 * @typedef {any} ExtractPromisedType<P>
 */


// Events, for documentation purposes

/**
 * Emits when the {@link Leveling} module is ready.
 * @event Leveling#ready
 * @param {Leveling<DatabaseType>} leveling Initialized {@link Leveling} instance.
 */

// [FILL IN]
