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
const FetchManager_1 = __importDefault(require("./FetchManager"));
const Errors_1 = __importDefault(require("../structures/Errors"));
const DotParser_1 = __importDefault(require("../classes/DotParser"));
const LevelingError_1 = __importDefault(require("../classes/LevelingError"));
/**
 * Database manager methods class.
 */
class DatabaseManager {
    /**
     * Dor Parser.
     * @type {DotParser}
     * @private
     */
    parser;
    /**
     * Fetch Manager.
     * @type {FetchManager}
     * @private
     */
    fetcher;
    /**
     * Database manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options = {}) {
        this.fetcher = new FetchManager_1.default(options);
        this.parser = new DotParser_1.default({ storagePath: options.storagePath || './leveling.json' });
    }
    /**
     * Gets a list of keys in database.
     * @param {String} key The key in database.
     * @returns {string[]} An array with all keys in database or 'null' if nothing found.
     */
    keyList(key) {
        const storageData = this.fetcher.fetchAll();
        const data = this.fetch(key);
        if (!key || typeof key !== 'string')
            return Object.keys(storageData).filter(x => storageData[x]);
        if (data == null)
            return null;
        const keys = Object.keys(data);
        return keys.filter(x => data[x] !== undefined && data[x] !== null);
    }
    /**
     * Sets data in a property in database.
     * @param {String} key The key in database.
     * @param {any} value Any data to set in property.
     * @returns {Boolean} If set successfully: true; else: false
     */
    set(key, value) {
        if (!key)
            return false;
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        if (value == undefined)
            return false;
        return this.parser.set(key, value);
    }
    /**
     * Adds a number to a property data in database.
     * @param {String} key The key in database.
     * @param {Number} value Any number to add.
     * @returns {Boolean} If added successfully: true; else: false
     */
    add(key, value) {
        const data = this.parser.parse(key);
        if (!key)
            return false;
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        if (isNaN(value))
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.value.number + typeof value);
        if (isNaN(data))
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.target.number + typeof data);
        const numData = Number(data);
        const numValue = Number(value);
        return this.set(key, numData + numValue);
    }
    /**
     * Subtracts a number from a property data in database.
     * @param {String} key The key in database.
     * @param {Number} value Any number to subtract.
     * @returns {Boolean} If set successfully: true; else: false
     */
    subtract(key, value) {
        const data = this.parser.parse(key);
        if (!key)
            return false;
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        if (isNaN(value))
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.value.number + typeof value);
        if (isNaN(data))
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.target.number + typeof data);
        const numData = Number(data);
        const numValue = Number(value);
        return this.set(key, numData - numValue);
    }
    /**
     * Fetches the data from the storage file.
     * @param {String} key The key in database.
     * @returns {any | false} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    fetch(key) {
        if (!key)
            return false;
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        return this.parser.parse(key);
    }
    /**
     * Removes the property from the existing object in database.
     * @param {String} key The key in database.
     * @returns {Boolean} If cleared: true; else: false.
     */
    remove(key) {
        if (!key)
            return false;
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        return this.parser.remove(key);
    }
    /**
     * Pushes a value to a specified array from the database.
     * @param {String} key The key in database.
     * @param {any} value The key in database.
     * @returns {Boolean} If cleared: true; else: false.
     */
    push(key, value) {
        if (!key)
            return false;
        if (value == undefined)
            return false;
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        let data = this.fetch(key) || [];
        if (!Array.isArray(data) && !data.length)
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.target.array + typeof data);
        data.push(value);
        return this.set(key, data);
    }
    /**
     * Removes an element from a specified array in the database.
     * @param {String} key The key in database.
     * @param {Number} index The index in the array.
     * @returns {Boolean} If cleared: true; else: false.
     */
    removeElement(key, index) {
        if (!key)
            return false;
        if (index == undefined)
            return false;
        if (typeof key !== 'string')
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.key + typeof key);
        let data = this.fetch(key);
        if (!Array.isArray(data))
            throw new LevelingError_1.default(Errors_1.default.databaseManager.invalidTypes.target.array + typeof data);
        data.splice(index, 1);
        return this.set(key, data);
    }
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    all() {
        return this.fetcher.fetchAll();
    }
}
module.exports = DatabaseManager;

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