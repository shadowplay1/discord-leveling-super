// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = require("fs");
const FetchManager_1 = __importDefault(require("../managers/FetchManager"));
const DefaultOptions_1 = __importDefault(require("../structures/DefaultOptions"));
/**
 * Dot parser class.
 * @private
 */
class DotParser {
    options;
    storagePath;
    fetcher;
    /**
     * Leveling constructor options object. There's only needed options object properties for this manager to work properly.
     * @param {Object} options Constructor options object.
     * @param {String} options.storagePath Full path to a JSON file. Default: './leveling.json'.
     */
    constructor(options = {}) {
        /**
         * Leveling constructor options object.
         * @private
         * @type {LevelingOptions}
         */
        this.options = options;
        /**
         * Fetch manager methods object.
         * @type {FetchManager}
         * @private
         */
        this.fetcher = new FetchManager_1.default(options);
        if (!options.storagePath)
            this.storagePath = DefaultOptions_1.default.storagePath;
    }
    /**
     * Parses the key and fetches the value from database.
     * @param {String} key The key in database.
     * @returns {any | false} The data from database or 'false' if failed to parse or 'null' if nothing found.
     */
    parse(key) {
        let parsed = this.fetcher.fetchAll();
        if (!key)
            return false;
        if (typeof key !== 'string')
            return false;
        const keys = key.split('.');
        let tmp = parsed;
        for (let i = 0; i < keys.length; i++) {
            if ((keys.length - 1) == i) {
                parsed = tmp?.[keys[i]] || null;
            }
            tmp = tmp?.[keys[i]];
        }
        return parsed || null;
    }
    /**
     * Parses the key and sets the data in database.
     * @param {String} key The key in database.
     * @param {any} value Any data to set.
     * @returns {Boolean} If set successfully: true; else: false
     */
    set(key, value) {
        const { isObject } = this;
        let storageData = this.fetcher.fetchAll();
        if (!key)
            return false;
        if (typeof key !== 'string')
            return false;
        if (value == undefined)
            return false;
        if (typeof value == 'function')
            return false;
        const keys = key.split('.');
        let tmp = storageData;
        for (let i = 0; i < keys.length; i++) {
            if ((keys.length - 1) == i) {
                tmp[keys[i]] = value;
            }
            else if (!isObject(tmp[keys[i]])) {
                tmp[keys[i]] = {};
            }
            tmp = tmp?.[keys[i]];
        }
        (0, fs_1.writeFileSync)(this.options.storagePath || './leveling.json', JSON.stringify(storageData, null, '\t'));
        return true;
    }
    /**
     * Parses the key and removes the data from database.
     * @param {String} key The key in database.
     * @returns {Boolean} If removed successfully: true; else: false
     */
    remove(key) {
        const { isObject } = this;
        let storageData = this.fetcher.fetchAll();
        if (!key)
            return false;
        if (typeof key !== 'string')
            return false;
        const data = this.parse(key);
        if (data == null)
            return false;
        const keys = key.split('.');
        let tmp = storageData;
        for (let i = 0; i < keys.length; i++) {
            if ((keys.length - 1) == i) {
                delete tmp?.[keys[i]];
            }
            else if (!isObject(tmp?.[keys[i]])) {
                tmp[keys[i]] = {};
            }
            tmp = tmp[keys[i]];
        }
        (0, fs_1.writeFileSync)(this.options.storagePath || './leveling.json', JSON.stringify(storageData, null, '\t'));
        return true;
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
}
module.exports = DotParser;
