// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

import { LevelingOptions } from "../../typings/interfaces/LevelingOptions";
import FetchManager from '../managers/FetchManager';
/**
 * Dot parser class.
 * @private
 */
declare class DotParser {
    options: LevelingOptions;
    storagePath: string;
    fetcher: FetchManager;
    /**
     * Leveling constructor options object. There's only needed options object properties for this manager to work properly.
     * @param {Object} options Constructor options object.
     * @param {String} options.storagePath Full path to a JSON file. Default: './leveling.json'.
     */
    constructor(options?: LevelingOptions);
    /**
     * Parses the key and fetches the value from database.
     * @param {String} key The key in database.
     * @returns {any | false} The data from database or 'false' if failed to parse or 'null' if nothing found.
     */
    parse(key: string): any | false;
    /**
     * Parses the key and sets the data in database.
     * @param {String} key The key in database.
     * @param {any} value Any data to set.
     * @returns {Boolean} If set successfully: true; else: false
     */
    set(key: string, value: any): boolean;
    /**
     * Parses the key and removes the data from database.
     * @param {String} key The key in database.
     * @returns {Boolean} If removed successfully: true; else: false
     */
    remove(key: string): boolean;
    /**
     * Checks for is the item object and returns it.
     * @param {any} item The item to check.
     * @returns {Boolean} Is the item object or not.
    */
    isObject(item: any): boolean;
}
export = DotParser;
