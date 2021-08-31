// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

const {
    Message, GuildMember, User,
    MessageEmbed, MessageAttachment, Guild,
    MessageOptions, Channel, TextChannel
} = require('discord.js')

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
     * @param {'xp' | 'maxXP' | 'multiplier' | 'status' | 'ignoredUsers' | 'lockedChannels' | 'ignoreBots' | 'filter'} key The setting to fetch.
     * @param {String} guild Guild or it's ID.
     * @returns {any} The setting from the database.
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
     * @param {'xp' | 'maxXP' | 'multiplier' | 'status' | 'ignoredUsers' | 'lockedChannels' | 'ignoreBots' | 'filter'} key The setting to change.
     * @param {any} value The value to set.
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
    * @param {'ignoredUsers' | 'lockedChannels'} key The setting to change.
    * @param {any} value The value to set.
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
    * @param {'ignoredUsers' | 'lockedChannels'} key The setting to change.
    * @param {any} value The value to remove.
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
     * @param {'xp' | 'maxXP' | 'multiplier' | 'status' | 'ignoredUsers' | 'lockedChannels' | 'ignoreBots' | 'filter'} key The setting to remove.
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

// ---------------------------------------
// Typedefs area starts here...
// ---------------------------------------

/**
 * @typedef {Object} VersionData
 * @property {Boolean} updated Is the module updated.
 * @property {installedVersion} installedVersion Version of module that you have installed.
 * @property {packageVersion} packageVersion Latest version of the module.
*/

/**
 * @typedef {Object} RankData
 * @property {UserData} userData User's data object.
 * @property {Number} level User's level
 * @property {Number} xp User's amount of XP.
 * @property {Number} totalXP User's total amount of XP.
 * @property {Number} maxXP How much XP in total the user need to reach the next level.
 * @property {Number} difference The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
 * @property {Number} multiplier XP Multiplier.
*/

/**
 * @typedef {Object} LeaderboardData Leaderboard data object.
 * @property {String} userID User's ID.
 * @property {Number} level User's level.
 * @property {Number} xp User's amount of XP.
 * @property {Number} totalXP User's amount of total XP.
 * @property {Number} maxXP User's data object.
 * @property {User} user User's data object.
 * @property {Number} difference User's amount of total XP.
 * @property {Number} multiplier XP Multiplier.
*/

/**
 * @typedef {Object} LevelingOptions Default Leveling options.
 * @property {String} [storagePath='./leveling.json'] Full path to a JSON file. Default: './leveling.json'.
 * @property {Boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {Boolean} [ignoreBots=true] If true, every message from bots won't give them XP. Default: true.
 * @property {Number} [xp=5] Amount of XP that user will receive after sending a message. Default: 5.
 * @property {Boolean} [status=true] You can enable or disable the leveling system using this option. Default: true.
 * @property {Number} [maxXP=300] Amount of XP that user will totally need to reach the next level. This value will double for each level. Default: 300.
 * @property {String[]} [lockedChannels=[]] Array of channel IDs that won't give XP to users. Default: [].
 * @property {String[]} [ignoredGuilds=[]] Array of guilds on which none of the members will be given XP. Default: [].
 * @property {Boolean} [multiplier=1] XP multiplier. Default: 1.
 * @property {FilterFunction} [filter=() => true] Callback function that must return a boolean value, it will add XP only to authors of filtered messages. Default: null.
 * @property {Number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {UpdaterOptions} [updater] Update Checker options object.
 * @property {ErrorHandlerOptions} [errorHandler] Error Handler options object.
*/

/**
 * @typedef {Object} UpdaterOptions Updatee options object.
 * @property {Boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @property {Boolean} [upToDateMessage=true] Sends the message in console on start if module is up to date. Default: true.
*/

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {Boolean} [handleErrors=true] Handles all errors on startup. Default: true.
 * @property {Number} [attempts=5] Amount of attempts to load the module. Use 0 for infinity attempts. Default: 5.
 * @property {Number} [time=3000] Time between every attempt to start the module (in ms). Default: 3000.
*/

/**
 * @typedef {Object} CheckerOptions Options object for an 'Leveling.utils.checkOptions' method.
 * @property {Boolean} [ignoreInvalidTypes=false] Allows the method to ignore the options with invalid types. Default: false.
 * @property {Boolean} [ignoreUnspecifiedOptions=false] Allows the method to ignore the unspecified  Default: false.
 * @property {Boolean} [ignoreInvalidOptions=false] Allows the method to ignore the unexisting  Default: false.
 * @property {Boolean} [showProblems=false] Allows the method to show all the problems in the console. Default: false.
 * @property {Boolean} [sendLog=false] Allows the method to send the result in the console. Default: false.
 * @property {Boolean} [sendSuccessLog=false] Allows the method to send the result if no problems were found. Default: false.
*/

/**
 * @typedef {Object} UserData User data object.
 * @property {String} id User's ID.
 * @property {String} username User's username.
 * @property {String} tag User's tag.
 * @property {String} discriminator User's discriminator.
*/

/**
 * @typedef {Object} LevelData
 * @property {Number} xp User's amount of XP.
 * @property {Number} totalXP User's total amount of XP.
 * @property {Number} level User's level.
 * @property {Number} maxXP How much XP in total the user need to reach the next level.
 * @property {Number} difference The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
 * @property {Number} multiplier User's XP multiplier.
 * @property {Boolean} onMessage The value will be true if the event was called on 'messageCreate' bot event.
*/

/**
 * @typedef {Object} XPData
 * @property {String} guildID Guild ID.
 * @property {String} userID User ID.
 * @property {Number} xp User's amount of XP.
 * @property {Number} totalXP User's total amount of XP.
 * @property {Number} level User's level.
 * @property {Number} maxXP How much XP in total the user need to reach the next level.
 * @property {Number} difference The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
 * @property {Number} multiplier User's XP multiplier.
 * @property {Boolean} onMessage The value will be true if the event was called on 'messageCreate' bot event.
*/

/**
 * @typedef {Object} LevelUpData
 * @property {String} guildID Guild ID.
 * @property {User} user The user that reached a new level.
 * @property {Number} level New level.
 * @property {Number} maxXP How much XP in total the user need to reach the next level.
 * @property {Number} difference The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
 * @property {Number} multiplier User's XP multiplier.
 * @property {Boolean} onMessage The value will be true if the event was called on 'messageCreate' bot event.
*/

/**
 * @typedef {Object} SettingsTypes
 * @property {Number} xp Amount of XP that user will receive after sending a message.
 * @property {Number} maxXP Amount of XP that user will totally need to reach the next level. This value will double for each level.
 * @property {Number} multiplier XP multiplier.
 * @property {Boolean} status You can enable or disable the leveling system using this option.
 * @property {String[]} ignoredUsers Array of user IDs that won't give XP.
 * @property {String[]} lockedChannels Array of channel IDs that won't give XP to users.
 * @property {Boolean} ignoreBots If true, every message from bots won't give them XP.
 * @property {String | FilterFunction} filter Callback function that must return a boolean value, it will add XP only to authors of filtered messages.
 */

/**
 * @typedef {Object} SettingsArrays
 * @property {String[]} ignoredUsers Array of user IDs that won't give XP.
 * @property {String[]} lockedChannels Array of channel IDs that won't give XP to users.
 */

/**
 * A function that will send a specified message to a specified channel.
 * @callback SendMessage
 * @param {String | MessageEmbed | MessageAttachment | MessageOptions} msg Message string, embed, attachment or message options.
 * @param {String | Channel} channel Channel or it's ID.
 * @returns {Promise<Message>}
 */

/**
 * Filter function that accepts a message;
 * it must return a boolean value and it will add XP
 * only to authors of filtered messages.;
 * Use 'null' to disable the filter. Default: '() => true'.
 * @callback FilterFunction
 * @param {Message} msg
 * @returns {Boolean} Boolean value.
*/