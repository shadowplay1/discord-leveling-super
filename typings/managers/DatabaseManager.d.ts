import { LevelingOptions } from '../../typings/interfaces/LevelingOptions';
/**
 * Database manager methods class.
 */
declare class DatabaseManager {
    /**
     * Dor Parser.
     * @type {DotParser}
     * @private
     */
    private parser;
    /**
     * Fetch Manager.
     * @type {FetchManager}
     * @private
     */
    private fetcher;
    /**
     * Database manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options?: LevelingOptions);
    /**
     * Gets a list of keys in database.
     * @param {String} key The key in database.
     * @returns {string[]} An array with all keys in database or 'null' if nothing found.
     */
    keyList(key: string): string[];
    /**
     * Sets data in a property in database.
     * @param {String} key The key in database.
     * @param {any} value Any data to set in property.
     * @returns {Boolean} If set successfully: true; else: false
     */
    set(key: string, value: any): boolean;
    /**
     * Adds a number to a property data in database.
     * @param {String} key The key in database.
     * @param {Number} value Any number to add.
     * @returns {Boolean} If added successfully: true; else: false
     */
    add(key: string, value: number): boolean;
    /**
     * Subtracts a number from a property data in database.
     * @param {String} key The key in database.
     * @param {Number} value Any number to subtract.
     * @returns {Boolean} If set successfully: true; else: false
     */
    subtract(key: string, value: number): boolean;
    /**
     * Fetches the data from the storage file.
     * @param {String} key The key in database.
     * @returns {any | false} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    fetch(key: string): any | false;
    /**
     * Removes the property from the existing object in database.
     * @param {String} key The key in database.
     * @returns {Boolean} If cleared: true; else: false.
     */
    remove(key: string): boolean;
    /**
     * Pushes a value to a specified array from the database.
     * @param {String} key The key in database.
     * @param {any} value The key in database.
     * @returns {Boolean} If cleared: true; else: false.
     */
    push(key: string, value: any): boolean;
    /**
     * Removes an element from a specified array in the database.
     * @param {String} key The key in database.
     * @param {Number} index The index in the array.
     * @returns {Boolean} If cleared: true; else: false.
     */
    removeElement(key: string, index: number): boolean;
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    all(): object;
}
export = DatabaseManager;
