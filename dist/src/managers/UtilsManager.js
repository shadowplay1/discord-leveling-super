"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = require("fs");
const DefaultOptions_1 = __importDefault(require("../structures/DefaultOptions"));
const FetchManager_1 = __importDefault(require("./FetchManager"));
const DatabaseManager_1 = __importDefault(require("./DatabaseManager"));
const DefaultObject_1 = __importDefault(require("../structures/DefaultObject"));
/**
 * Utils manager methods class.
 */
class UtilsManager {
    /**
     * Fetch Manager.
     * @type {FetchManager}
     * @private
     */
    fetcher;
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    database;
    /**
     * Discord Bot Client.
     * @type {Client}
     * @private
     */
    client;
    /**
     * Leveling Options.
     * @type {LevelingOptions}
     * @private
     */
    options;
    /**
     * Utils manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options, client) {
        this.options = options;
        this.client = client;
        this.database = new DatabaseManager_1.default(options);
        this.fetcher = new FetchManager_1.default(options);
    }
    /**
    * Checks for if the module is up to date.
    * @returns {Promise<VersionData>} This method will show is the module updated, latest version and installed version.
    */
    async checkUpdates() {
        const version = require('../../package.json').version;
        const packageData = await (0, node_fetch_1.default)('https://registry.npmjs.com/discord-leveling-super')
            .then((text) => text.json());
        if (version == packageData['dist-tags'].latest)
            return {
                updated: true,
                installedVersion: version,
                packageVersion: packageData['dist-tags'].latest
            };
        return {
            updated: false,
            installedVersion: version,
            packageVersion: packageData['dist-tags'].latest
        };
    }
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    all() {
        return this.fetcher.fetchAll();
    }
    /**
     * Writes the data to file.
     * @param {String} path File path to write.
     * @param {any} data Any data to write
     * @returns {Boolean} If successfully written: true; else: false.
     */
    write(path, data) {
        if (!path)
            return false;
        if (!data)
            return false;
        const fileData = (0, fs_1.readFileSync)(path).toString();
        if (fileData == data)
            return false;
        (0, fs_1.writeFileSync)(this.options.storagePath || './leveling.json', JSON.stringify(data, null, '\t'));
        return true;
    }
    /**
     * Clears the storage file.
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    clearStorage() {
        const data = this.all();
        const stringData = String(data);
        if (stringData == '{}')
            return false;
        this.write(this.options.storagePath || './leveling.json', '{}');
        return true;
    }
    /**
    * Fully removes the guild from database.
    * @param {String} guildID Guild ID
    * @returns {Boolean} If cleared successfully: true; else: false
    */
    removeGuild(guildID) {
        const data = this.fetcher.fetchAll();
        const guild = data[guildID];
        if (!guildID)
            return false;
        if (!guild)
            return false;
        this.database.remove(guildID);
        return true;
    }
    /**
     * Removes the user from database.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    removeUser(memberID, guildID) {
        const data = this.fetcher.fetchAll();
        const guild = data[guildID];
        const user = guild?.[memberID];
        if (!guildID)
            return false;
        if (!guild)
            return false;
        if (!user)
            return false;
        this.database.remove(`${guildID}.${memberID}`);
        return true;
    }
    /**
     * Sets the default user object for the specified member.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @param {RankData} object Custom rank object to set.
     * @returns {Boolean} If reset is successful: true; else: false.
     */
    reset(memberID, guildID, object) {
        const dataObject = DefaultObject_1.default;
        if (!guildID)
            return false;
        if (!memberID)
            return false;
        if (object)
            return this.database.set(`${guildID}.${memberID}`, object);
        const user = this.client.users.cache.get(memberID);
        if (!user)
            return false;
        dataObject.userData = {
            id: memberID,
            username: user.username,
            tag: user.tag,
            discriminator: user.discriminator
        };
        dataObject.xp = 0;
        dataObject.totalXP = 0;
        return this.database.set(`${guildID}.${memberID}`, dataObject);
    }
    /**
     * Returns a rank object with specified values.
     * @param {LevelData} options Rank object to use.
     * @returns {LevelData} Rank object with specified values.
     */
    getRankObject(options) {
        const isDefined = (val) => val !== undefined ? val : false;
        if (!options)
            return {
                userData: null,
                guildID: null,
                userID: null,
                xp: null,
                totalXP: null,
                level: null,
                maxXP: null,
                difference: null,
                multiplier: null
            };
        return {
            userData: isDefined(options.userData) || null,
            guildID: isDefined(options.guildID) || null,
            userID: isDefined(options.userID) || null,
            xp: isDefined(options.xp) || null,
            totalXP: isDefined(options.totalXP) || null,
            level: isDefined(options.level) || null,
            maxXP: isDefined(options.maxXP) || null,
            difference: isDefined(options.difference) || null,
            multiplier: isDefined(options.multiplier) || null
        };
    }
    /**
     * Returns the type or instance of specified item.
     * @param {any} item The item to get the type of.
     * @returns {String} Type or instance of the item.
     */
    typeOf(item) {
        return item === null ?
            'null' :
            item === undefined ?
                'undefined' :
                item.constructor.name && item.name
                    ? item.name :
                    item.constructor.name;
    }
    /**
    * Checks for is the item object and returns it.
    * @param {any} item The item to check.
    * @returns {Boolean} Is the item object or not.
    */
    isObject(item) {
        return !Array.isArray(item)
            && typeof item == 'object'
            && item !== null;
    }
    /**
     * Checks the Leveling options object, fixes the problems in it and returns the fixed options object.
     * @param {CheckerOptions} options Option checker options.
     * @param {LevelingOptions} levelingOptions Leveling options object to check.
     * @returns {LevelingOptions} Fixed Leveling options object.
    */
    checkOptions(options = {}, levelingOptions) {
        const unset = (obj, key) => {
            const keys = key.split('.');
            let tmp = obj;
            for (let i = 0; i < keys.length; i++) {
                if ((keys.length - 1) == i) {
                    delete tmp[keys[i]];
                }
                else if (!this.isObject(tmp[keys[i]])) {
                    tmp[keys[i]] = {};
                }
                tmp = tmp[keys[i]];
            }
        };
        let problems = [];
        let output = {};
        const keys = Object.keys(DefaultOptions_1.default);
        const optionKeys = Object.keys(levelingOptions || {});
        if (typeof levelingOptions !== 'object' && !Array.isArray(levelingOptions)) {
            problems.push('options is not an object. Received type: ' + typeof levelingOptions);
            output = DefaultOptions_1.default;
        }
        else {
            if (!optionKeys.length) {
                problems.push('options object is empty.');
                return DefaultOptions_1.default;
            }
            for (let i of keys) {
                if (levelingOptions[i] == undefined) {
                    output[i] = DefaultOptions_1.default[i];
                    if (!options.ignoreUnspecifiedOptions)
                        problems.push(`options.${i} is not specified.`);
                }
                else {
                    output[i] = levelingOptions[i];
                }
                for (let y of Object.keys(DefaultOptions_1.default[i])) {
                    if (levelingOptions[i]?.[y] == undefined || output[i]?.[y] == undefined) {
                        try {
                            output[i][y] = DefaultOptions_1.default[i][y];
                        }
                        catch (_) { }
                        if (!options.ignoreUnspecifiedOptions && isNaN(Number(y)))
                            problems.push(`options.${i}.${y} is not specified.`);
                    }
                    else { }
                }
                if (typeof output[i] !== typeof DefaultOptions_1.default[i]) {
                    if (!options.ignoreInvalidTypes) {
                        if (i == 'xp') {
                            if (typeof output[i] !== 'number' && !Array.isArray(output[i])) {
                                problems.push(`options.${i} is not a ${i == 'xp' ? 'number or array' : typeof DefaultOptions_1.default[i]}. Received type: ${typeof output[i]}.`);
                                output[i] = DefaultOptions_1.default[i];
                            }
                        }
                        else {
                            problems.push(`options.${i} is not a ${typeof DefaultOptions_1.default[i]}. Received type: ${typeof output[i]}.`);
                            output[i] = DefaultOptions_1.default[i];
                        }
                    }
                }
                else { }
                for (let y of Object.keys(DefaultOptions_1.default[i])) {
                    if (typeof output[i]?.[y] !== typeof DefaultOptions_1.default[i][y]) {
                        if (!options.ignoreInvalidTypes)
                            problems.push(`options.${i}.${y} is not a ${typeof DefaultOptions_1.default[i][y]}. Received type: ${typeof output[i][y]}.`);
                        output[i][y] = DefaultOptions_1.default[i][y];
                    }
                    else { }
                }
            }
            for (let i of optionKeys) {
                const defaultIndex = keys.indexOf(i);
                const objectKeys = Object.keys(levelingOptions?.[i]);
                for (let y of objectKeys) {
                    const allKeys = Object.keys(DefaultOptions_1.default[i] || '0');
                    const index = allKeys.indexOf(y);
                    if (!allKeys[index] && isNaN(Number(y))) {
                        problems.push(`options.${i}.${y} is an invalid option.`);
                        unset(output, `${i}.${y}`);
                    }
                }
                if (!keys[defaultIndex]) {
                    unset(output, i);
                    problems.push(`options.${i} is an invalid option.`);
                }
            }
        }
        if (options.sendLog) {
            if (options.showProblems)
                console.log(`Checked the options: ${problems.length ?
                    `${problems.length} problems found:\n\n${problems.join('\n')}` : '0 problems found.'}`);
            if (options.sendSuccessLog && !options.showProblems)
                console.log(`Checked the options: ${problems.length} ${problems.length == 1 ? 'problem' : 'problems'} found.`);
        }
        if (output == DefaultOptions_1.default)
            return levelingOptions;
        else
            return output;
    }
}
module.exports = UtilsManager;
