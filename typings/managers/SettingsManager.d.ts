import { Client, Guild } from 'discord.js';
import { LevelingOptions } from '../../typings/interfaces/LevelingOptions';
import { SettingsArrays, SettingsTypes } from '../../typings/interfaces/Settings';
/**
 * Settings manager methods class.
 */
declare class SettingsManager {
    /**
     * Leveling Options.
     * @type {LevelingOptions}
     * @private
     */
    private options;
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    private database;
    /**
     * Utils Manager.
     * @type {UtilsManager}
     * @private
     */
    private utils;
    /**
     * Ranks manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions, client: Client);
    /**
     * Gets the specified setting from the database.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * options object or default options object.
     *
     * @param {keyof SettingsTypes} key The setting to fetch.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes[K]} The setting from the database.
     */
    get<K extends keyof SettingsTypes>(key: K, guild: string | Guild): SettingsTypes[K];
    /**
     * Changes the specified setting.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * options object or default options object.
     *
     * @param {keyof SettingsTypes} key The setting to change.
     * @param {SettingsTypes[K]} value The value to set.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    set<K extends keyof SettingsTypes>(key: K, value: SettingsTypes[K], guild: string | Guild): SettingsTypes;
    /**
    * Pushes the element in a setting's array.
    *
    * Note: If the server don't have any setting specified,
    * the module will take the values from the
    * options object or default options object.
    *
    * @param {keyof SettingsArrays} key The setting to change.
    * @param {SettingsArrays[K]} value The value to set.
    * @param {String} guild Guild or it's ID.
    * @returns {SettingsTypes} The server settings object.
    */
    push<K extends keyof SettingsArrays>(key: K, value: SettingsArrays[K], guild: string | Guild): SettingsTypes;
    /**
    * Removes the element from a setting's array.
    *
    * Note: If the server don't have any setting specified,
    * the module will take the values from the
    * options object or default options object.
    *
    * @param {keyof SettingsArrays} key The setting to change.
    * @param {SettingsArrays[K]} value The value to remove.
    * @param {String} guild Guild or it's ID.
    * @returns {SettingsTypes} The server settings object.
    */
    unpush<K extends keyof SettingsArrays>(key: K, value: any, guild: string | Guild): SettingsTypes;
    /**
     * Removes the specified setting.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * options object or default options object.
     *
     * @param {keyof SettingsTypes} key The setting to remove.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    remove<K extends keyof SettingsTypes>(key: K, guild: string | Guild): SettingsTypes;
    /**
     * Fetches the server's settings object.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    all(guild: string | Guild): SettingsTypes;
    /**
     * Resets all the settings to setting that are in options object.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    reset(guild: string | Guild): SettingsTypes;
}
export = SettingsManager;
