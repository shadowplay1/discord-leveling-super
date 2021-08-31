// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

import { Client } from 'discord.js';
import CheckerOptions from '../../typings/interfaces/CheckerOptions';
import { LevelingOptions } from '../../typings/interfaces/LevelingOptions';
import { UpdateData } from '../../typings/interfaces/UpdateData';
import { LevelData } from '../../typings/interfaces/LevelData';
import { RankData } from '../../typings/interfaces/RankData';
/**
 * Utils manager methods class.
 */
declare class UtilsManager {
    /**
     * Fetch Manager.
     * @type {FetchManager}
     * @private
     */
    private fetcher;
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    private database;
    /**
     * Discord Bot Client.
     * @type {Client}
     * @private
     */
    private client;
    /**
     * Leveling Options.
     * @type {LevelingOptions}
     * @private
     */
    private options;
    /**
     * Utils manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions, client?: Client);
    /**
    * Checks for if the module is up to date.
    * @returns {Promise<VersionData>} This method will show is the module updated, latest version and installed version.
    */
    checkUpdates(): Promise<UpdateData>;
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    all(): object;
    /**
     * Writes the data to file.
     * @param {String} path File path to write.
     * @param {any} data Any data to write
     * @returns {Boolean} If successfully written: true; else: false.
     */
    write(path: string, data: any): boolean;
    /**
     * Clears the storage file.
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    clearStorage(): boolean;
    /**
    * Fully removes the guild from database.
    * @param {String} guildID Guild ID
    * @returns {Boolean} If cleared successfully: true; else: false
    */
    removeGuild(guildID: string): boolean;
    /**
     * Removes the user from database.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    removeUser(memberID: string, guildID: string): boolean;
    /**
     * Sets the default user object for the specified member.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @param {RankData} object Custom rank object to set.
     * @returns {Boolean} If reset is successful: true; else: false.
     */
    reset(memberID: string, guildID: string, object?: RankData): boolean;
    /**
     * Returns a rank object with specified values.
     * @param {LevelData} options Rank object to use.
     * @returns {LevelData} Rank object with specified values.
     */
    getRankObject(options?: LevelData): LevelData;
    /**
     * Returns the type or instance of specified item.
     * @param {any} item The item to get the type of.
     * @returns {String} Type or instance of the item.
     */
    typeOf(item: any): string;
    /**
    * Checks for is the item object and returns it.
    * @param {any} item The item to check.
    * @returns {Boolean} Is the item object or not.
    */
    isObject(item: any): boolean;
    /**
     * Checks the Leveling options object, fixes the problems in it and returns the fixed options object.
     * @param {CheckerOptions} options Option checker options.
     * @param {LevelingOptions} levelingOptions Leveling options object to check.
     * @returns {LevelingOptions} Fixed Leveling options object.
    */
    checkOptions(options: CheckerOptions, levelingOptions: LevelingOptions): LevelingOptions;
}
export = UtilsManager;
