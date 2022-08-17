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
