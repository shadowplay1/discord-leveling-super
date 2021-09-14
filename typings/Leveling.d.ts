// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

/// <reference types="node" />
import { Client } from 'discord.js';
import Emitter from './classes/Emitter';
import LevelingError from './classes/LevelingError';
import { LevelingOptions } from '../typings/interfaces/LevelingOptions';
import UtilsManager from './managers/UtilsManager';
import DatabaseManager from './managers/DatabaseManager';
import FetchManager from './managers/FetchManager';
import RanksManager from './managers/RanksManager';
import XPManager from './managers/XPManager';
import LevelManager from './managers/LevelManager';
import TotalXPManager from './managers/TotalXPManager';
import SettingsManager from './managers/SettingsManager';
/**
 * The Leveling class.
 * @extends {Emitter}
 */
declare class Leveling extends Emitter {
    /**
     * Leveling options object.
     * @type {LevelingOptions}
     */
    options: LevelingOptions;
    /**
     * Discord Bot Client
     * @type {Client}
     */
    client: Client;
    /**
     * Module ready status.
     * @type {Boolean}
     */
    ready: boolean;
    /**
     * Module errored status.
     * @type {Boolean}
     */
    errored: boolean;
    /**
     * Database checking interval.
     * @type {NodeJS.Timeout}
     */
    interval: NodeJS.Timeout;
    /**
    * Leveling error class.
    * @type {LevelingError}
    */
    LevelingError: typeof LevelingError;
    /**
     * Utils manager methods object.
     * @type {UtilsManager}
     */
    utils: UtilsManager;
    /**
     * Module version.
     * @type {String}
     */
    version: string;
    /**
     * Link to the module's documentation website.
     * @type {String}
     */
    docs: string;
    /**
    * Database manager methods object.
    * @type {DatabaseManager}
    */
    database: DatabaseManager;
    /**
    * XP manager methods object.
    * @type {FetchManager}
    */
    fetcher: FetchManager;
    /**
     * Settings manager methods class.
     * @type {SettingsManager}
     */
    settings: SettingsManager;
    /**
    * XP manager methods object.
    * @type {XPManager}
    */
    xp: XPManager;
    /**
    * Level manager methods object.
    * @type {LevelManager}
    */
    levels: LevelManager;
    /**
    * Total XP manager methods object.
    * @type {LevelManager}
    */
    totalXP: TotalXPManager;
    /**
    * Ranks manager methods object.
    * @type {RanksManager}
    */
    ranks: RanksManager;
    /**
     * The Leveling class.
     * @param {Client} client Discord Bot Client.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(client: Client, options?: LevelingOptions);
    /**
    * Kills the Leveling instance.
    * @fires Leveling#destroy
    * @returns {Leveling | boolean} Leveling instance.
    */
    kill(): Leveling | boolean;
    /**
    * Starts the module.
    * @fires Leveling#ready
    * @returns {Promise<Boolean>} If started successfully: true; else: Error instance.
    */
    init(): Promise<boolean | void>;
    /**
     * Initializates the module.
     * @returns {Promise<boolean>} If started successfully: true; else: Error instance.
     * @private
     */
    _init(): Promise<boolean>;
    /**
     * Starts all the managers.
     * @returns {Boolean} If successfully started: true.
     * @private
     */
    start(): boolean;
}
export = Leveling;
