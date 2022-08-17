"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const LevelingError_1 = __importDefault(require("../classes/LevelingError"));
const Errors_1 = __importDefault(require("../structures/Errors"));
const DatabaseManager_1 = __importDefault(require("./DatabaseManager"));
const UtilsManager_1 = __importDefault(require("./UtilsManager"));
const SettingsArray = [
    'xp',
    'maxXP',
    'multiplier',
    'status',
    'ignoredUsers',
    'lockedChannels',
    'ignoreBots',
    'filter'
];
/**
 * Settings manager methods class.
 */
class SettingsManager {
    /**
     * Leveling Options.
     * @type {LevelingOptions}
     * @private
     */
    options;
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    database;
    /**
     * Utils Manager.
     * @type {UtilsManager}
     * @private
     */
    utils;
    /**
     * Ranks manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options, client) {
        this.options = options;
        this.database = new DatabaseManager_1.default(options);
        this.utils = new UtilsManager_1.default(options, client);
    }
    /**
     * Gets the specified setting from the database.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * options object or default options object.
     *
     * @param {SettingsTypes} key The setting to fetch.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The setting from the database.
     */
    get(key, guild) {
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        if (!SettingsArray.includes(key))
            throw new LevelingError_1.default(Errors_1.default.settingsManager.invalidKey + key);
        const botGuild = isGuild ? guild.id : guild.toString();
        const data = this.all(botGuild);
        const dbValue = data[key];
        return dbValue;
    }
    /**
     * Changes the specified setting.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * options object or default options object.
     *
     * @param {SettingsTypes} key The setting to change.
     * @param {SettingsTypes} value The value to set.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    set(key, value, guild) {
        const isGuild = guild instanceof discord_js_1.Guild;
        if (value == undefined)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.value + typeof value);
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        if (!SettingsArray.includes(key))
            throw new LevelingError_1.default(Errors_1.default.settingsManager.invalidKey + key);
        const botGuild = isGuild ? guild.id : guild.toString();
        if (key == 'filter')
            this.database.set(`${botGuild}.settings.${key}`, value.toString());
        else
            this.database.set(`${botGuild}.settings.${key}`, value);
        return this.all(botGuild);
    }
    /**
    * Pushes the element in a setting's array.
    *
    * Note: If the server don't have any setting specified,
    * the module will take the values from the
    * options object or default options object.
    *
    * @param {SettingsArrays} key The setting to change.
    * @param {SettingsArrays} value The value to set.
    * @param {String} guild Guild or it's ID.
    * @returns {SettingsTypes} The server settings object.
    */
    push(key, value, guild) {
        const isGuild = guild instanceof discord_js_1.Guild;
        if (value == undefined)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.value + typeof value);
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        if (!SettingsArray.includes(key))
            throw new LevelingError_1.default(Errors_1.default.settingsManager.invalidKey + key);
        const botGuild = isGuild ? guild.id : guild.toString();
        const data = this.get(key, guild);
        const type = this.utils.typeOf(data);
        if (type !== 'Array')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.target.array + type);
        this.database.push(`${botGuild}.settings.${key}`, value);
        return this.all(botGuild);
    }
    /**
    * Removes the element from a setting's array.
    *
    * Note: If the server don't have any setting specified,
    * the module will take the values from the
    * options object or default options object.
    *
    * @param {SettingsArrays} key The setting to change.
    * @param {SettingsArrays} value The value to remove.
    * @param {String} guild Guild or it's ID.
    * @returns {SettingsTypes} The server settings object.
    */
    unpush(key, value, guild) {
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        if (!SettingsArray.includes(key))
            throw new LevelingError_1.default(Errors_1.default.settingsManager.invalidKey + key);
        const botGuild = isGuild ? guild.id : guild.toString();
        const data = this.get(key, guild);
        const index = data.indexOf(value);
        const type = this.utils.typeOf(data);
        if (type !== 'Array')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.target.array + type);
        if (index == -1)
            throw new LevelingError_1.default(Errors_1.default.settingsManager.valueNotFound(key, value));
        this.database.removeElement(`${botGuild}.settings.${key}`, index);
        return this.all(botGuild);
    }
    /**
     * Removes the specified setting.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * options object or default options object.
     *
     * @param {SettingsTypes} key The setting to remove.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    remove(key, guild) {
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        if (!SettingsArray.includes(key))
            throw new LevelingError_1.default(Errors_1.default.settingsManager.invalidKey + key);
        const botGuild = isGuild ? guild.id : guild.toString();
        this.database.remove(`${botGuild}.settings.${key}`);
        return this.all(guild);
    }
    /**
     * Fetches the server's settings object.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    all(guild) {
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const botGuild = isGuild ? guild.id : guild.toString();
        const settings = this.database.fetch(`${botGuild}.settings`);
        return {
            xp: settings?.xp == null ? null : settings?.xp,
            maxXP: settings?.maxXP == null ? null : settings?.maxXP,
            multiplier: settings?.multiplier == null ? null : settings?.multiplier,
            status: settings?.status == null ? null : settings?.status,
            ignoreBots: settings?.ignoreBots == null ? null : settings?.ignoreBots,
            ignoredUsers: settings?.ignoredUsers == null ? null : settings?.ignoredUsers,
            lockedChannels: settings?.lockedChannels == null ? null : settings?.lockedChannels,
            filter: settings?.filter || null
        };
    }
    /**
     * Resets all the settings to setting that are in options object.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    reset(guild) {
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const botGuild = isGuild ? guild.id : guild.toString();
        const defaultSettings = {
            xp: this.options.xp,
            maxXP: this.options.maxXP,
            multiplier: this.options.multiplier,
            status: this.options.status,
            ignoreBots: this.options.ignoreBots,
            ignoredUsers: this.options.ignoredUsers,
            lockedChannels: this.options.lockedChannels,
            filter: this.options.filter
        };
        this.database.set(`${botGuild}.settings`, defaultSettings);
        return defaultSettings;
    }
}
module.exports = SettingsManager;
