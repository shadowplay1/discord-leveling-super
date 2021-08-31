// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

import { Guild, GuildMember, User } from 'discord.js';
import { LevelingOptions } from '../../typings/interfaces/LevelingOptions';
import Emitter from '../classes/Emitter';
import DatabaseManager from './DatabaseManager';
/**
 * Level manager methods class.
 * @extends {Emitter}
 */
declare class LevelManager extends Emitter {
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    database: DatabaseManager;
    /**
     * Leveling manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions);
    /**
     * Gets the XP for specified user.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Number} Amount of levels.
     */
    get(member: string | GuildMember | User, guild: string | Guild): number;
    /**
     * Sets the XP for specified user.
     * @fires Leveling#setLevel
     * @param {Number} level Amount of levels.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If set successfully: true, else: false.
     */
    set(level: number, member: string | GuildMember | User, guild: string | Guild): boolean;
    /**
     * Adds the XP for specified user.
     * @fires Leveling#addLevel
     * @param {Number} level Amount of levels.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @param {Boolean} onMessage The value will be true if the method was called on 'messageCreate' bot event.
     * @returns {Boolean} If added successfully: true, else: false.
     */
    add(level: number, member: string | GuildMember | User, guild: string | Guild, onMessage?: boolean): boolean;
    /**
     * Subtracts the XP for specified user.
     * @fires Leveling#subtractLevel
     * @param {Number} level Amount of levels.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If subtracted successfully: true, else: false.
     */
    subtract(level: number, member: string | GuildMember | User, guild: string | Guild): boolean;
}
export = LevelManager;
