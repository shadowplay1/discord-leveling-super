import { GuildMember, Message, Client } from 'discord.js';
declare module 'discord-leveling-super' {
    import { EventEmitter } from 'events';
    /**
     * The Leveling class.
     */
    class Leveling extends EventEmitter {
        /**
         * Module version.
         */
        public version: string;
        /**
         * Module ready status.
         */
        public ready: boolean;
        /**
         * Leveling errored status.
         */
        public errored: boolean
        /**
         * Constructor options object.
         */
        public options: LevelingOptions
        /**
         * Database checking interval.
         */
        public interval: NodeJS.Timeout | null
        /**
         * Leveling errors object.
         */
        public errors: LevelingErrorList
        /**
         * 'LevelingError' Error instance.
         */
        public LevelingError: LevelingError
        /**
         * The Leveling class.
         * @param {Client} client Discord Bot Client.
         * @param {LevelingOptions} options Constructor options object.
         */
        constructor(client: Client, options?: LevelingOptions)
        /**
        * Fetches the entire database.
        * @returns {Object} Database contents
        */
        all(): Object
        /**
        * Clears the storage file.
        * @returns {Boolean} If cleared successfully: true; else: false
        */
        clearStorage(): Boolean
        /**
        * Fetches the user's rank.
        * @param {String} guildID Guild ID
        * @param {String} memberID Member ID
        * @returns User's rank.
        */
        rank(memberID: string, guildID: string): LevelData
        /**
        * Shows a level leaderboard for your server.
        * @param {String} guildID Guild ID.
        * @returns Sorted leaderboard array.
        */
        leaderboard(guildID: string): LeaderboardData[]
        /**
        * Sets the level to specified user.
        * @param {Number | String} level New level.
        * @param {String} guildID Guild ID.
        * @param {String} memberID Member ID.
        * @returns Data object.
        */
        setLevel(level: number | string, memberID: string, guildID: string): LevelData
        /**
        * Adds the level to specified user.
        * @param {Number | String} level Amount of levels to add.
        * @param {String} guildID Guild ID.
        * @param {String} memberID Member ID.
        * @returns Data object.
        */
        addLevel(level: number | string, memberID: string, guildID: string): LevelData
        /**
        * Sets the XP to specified user.
        * @param {Number | String} level Amount of XP to set.
        * @param {String} guildID Guild ID.
        * @param {String} memberID Member ID.
        * @returns Data object.
        */
        setXP(xp: number | string, memberID: string, guildID: string): LevelData
        /**
        * Sets the XP to specified user.
        * @param {Number | String} level Amount of XP to add.
        * @param {String} guildID Guild ID.
        * @param {String} memberID Member ID.
        * @returns Data object.
        */
        addXP(xp: number | string, memberID: string, guildID: string): LevelData
        /**
        * Sets the total XP to specified user.
        * @param {Number | String} level Amount of XP to set.
        * @param {String} guildID Guild ID.
        * @param {String} memberID Member ID.
        * @returns Data object.
        */
        setTotalXP(xp: number | string, memberID: string, guildID: string): LevelData
        /**
        * Adds the total XP to specified user.
        * @param {Number | String} level Amount of XP to add.
        * @param {String} guildID Guild ID.
        * @param {String} memberID Member ID.
        * @returns Data object.
        */
        addTotalXP(xp: number | string, memberID: string, guildID: string): LevelData
        /**
        * Fully removes the guild from database.
        * @param {String} guildID Guild ID
        * @returns {Boolean} If cleared successfully: true; else: false
        */
        removeGuild(guildID: string): boolean
        /**
        * Removes the user from database.
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns {Boolean} If cleared successfully: true; else: false
        */
        removeUser(memberID: string, guildID: string): boolean
        /**
         * This method will show is the module updated, latest version and installed version. [Promise: Object]
         * @returns If started successfully: true; else: Error object.
         */
        checkUpdates(): Promise<ModuleData>;
        /**
         * Kills the Leveling instance.
         * @returns {this} Leveling instance.
         */
        kill(): this
        /**
         * Starts the module.
         * @returns If started successfully: true; else: Error instance.
         */
        init(): Promise<true | Error>
        on<K extends keyof LevelingEvents>(
            event: K,
            listener: (...args: LevelingEvents[K][]) => void
        ): this;
        once<K extends keyof LevelingEvents>(
            event: K,
            listener: (...args: LevelingEvents[K][]) => void
        ): this;
        emit<K extends keyof LevelingEvents>(event: K, ...args: LevelingEvents[K][]): boolean;
    }
    class LevelingError extends Error {
        /**
         * Name of the error
         */
        public name: 'LevelingError'
        /**
        * Creates an 'LevelingError' error instance.
        * @param {String | Error} message Error message.
        */
        constructor(message: string | Error) { }
    }
    namespace Leveling {
        declare const version: '1.0.2'
    }
    export = Leveling;
}
interface LevelingOptions {
    /**
    * Full path to a JSON file. Default: './storage.json'.
    */
    storagePath?: string;
    /**
     * Checks the if database file exists and if it has errors. Default: true.
     */
    checkStorage?: boolean;
    /**
     * Amount of XP that user will receive after sending a message. Default: 5.
     */
    xp?: number;
    /**
     * You can enable or disable the leveling system using this option. Default: true.
     */
    status?: boolean;
    /**
     * Amount of XP that user will totally need to reach the next level. This value will double for each level. Default: 300.
     */
    maxXP?: number;
    /**
     * Array of channel IDs that won't give XP to users. Default: [].
     */
    lockedChannels: Array<String>;
    /**
    * Callback function that accepts amessage, it must return a boolean value and it will add XP only to authors of filtered messages.; Use 'null' to disable the filter. Default: null.
    * @param {Message} msg
    * @returns {Boolean} Boolean value.
    */
    filter?(msg): Boolean
    /**
     * Checks for if storage file exists in specified time (in ms). Default: 1000.
     */
    updateCooldown?: number;
    /**
    * Update Checker options object.
    */
    updater?: {
        /**
         * Sends the update state message in console on start. Default: true.
         */
        checkUpdates: boolean;
        /**
         * Sends the message in console on start if module is up to date. Default: true.
         */
        upToDateMessage: boolean;
    };
    /**
    * Error Handler options object.
    */
    errorHandler?: {
        /**
         * Handles all errors on startup. Default: true.
         */
        handleErrors: boolean;
        /**
         * Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5.
         */
        attempts: number;
        /**
         * Time between every attempt to start the module (in ms). Default: 3000.
         */
        time: number;
    }
}
interface LevelData {
    /**
     * Guild ID.
     */
    guildID: string
    /**
     * User ID.
     */
    userID: string
    /**
     * User's amount of XP.
     */
    xp: number
    /**
     * User's total amount of XP.
     */
    totalXP: number
    /**
     * User's level.
     */
    level: number
    /**
    * How much XP in total the user need to reach the next level.
    */
    maxXP: number
    /**
    * The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
    */
    difference: number
}
interface LevelUpData {
    /**
     * Guild ID.
     */
    guildID: string
    /**
     * The user reached a new level.
     */
    user: GuildMember,
    /**
     * New level.
     */
    level: number,
    /**
    * How much XP in total the user need to reach the next level.
    */
    maxXP: number,
    /**
     * A function that will send a specified message to a specified channel.
     * @param {String} msg Your message
     * @param {String} channel Channel ID
     */
    sendMessage(msg: String, channel?: String): Promise<Message>
}
interface ModuleData {
    /**
     * Checks for if module is up to date.
     */
    updated: boolean,
    /**
     * Shows an installed version of the module
     */
    installedVersion: string,
    /**
     * Shows the latest version of the module
     */
    packageVersion: string
}
interface LeaderboardData {
    userID: String,
    level: Number,
    totalXP: Number,
    xp: Number,
    maxXP: Number,
    difference: Number,
    user: GuildMember
}
interface LevelingEvents {
    levelUp: LevelUpData,
    setLevel: LevelData,
    addLevel: LevelData,
    setXP: LevelData,
    addXP: LevelData,
    setTotalXP: LevelData,
    addTotalXP: LevelData
}
interface LevelingErrorList {
    noClient: 'Specify the bot client.',
    notReady: 'The module is not ready to work.',
    oldNodeVersion: 'This module is supporting only Node.js v14 or newer. Installed version is ',
    invalidStorage: 'Storage file is not valid.',
    wrongStorageData: 'Storage file contains wrong data.',
    invalidTypes: {
        memberID: 'memberID must be a string. Received type: ',
        guildID: 'guildID must be a string. Received type: ',
        level: 'level must be a number or string. Received type: ',
        xp: 'xp must be a number or string. Received type: ',
        constructorOptions: {
            options: 'options must be type of object. Received: ',
            updaterType: 'options.updater must be type of object. Received: ',
            errorHandlerType: 'options.errorHandler must be type of object. Received: ',
            storatePath: 'options.storagePath must be type of string. Received type: ',
            updateCountdown: 'options.updateCountdown must be type of number. Received type: ',
            errorHandler: {
                handleErrors: 'options.errorHandler.handleErrors must be type of boolean. Received type: ',
                attempts: 'options.errorHandler.attempts must be type of number. Received type: ',
                time: 'options.errorHandler.time must be type of number. Received type: '
            },
            updater: {
                checkUpdates: 'options.updater.checkUpdates must be type of boolean. Received type: ',
                upToDateMessage: 'options.updater.upToDateMessage must be type of boolean. Received type: '
            }
        }
    }
}