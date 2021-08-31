// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

import { Guild, GuildMember, User } from 'discord.js';
import { LevelingOptions } from '../../typings/interfaces/LevelingOptions';
import Emitter from '../classes/Emitter';
/**
 * Total XP manager methods class.
 * @extends {Emitter}
 */
declare class TotalXPManager extends Emitter {
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    private database;
    /**
     * Total XP manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions);
    /**
     * Gets the XP for specified user.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Number} Amount of total XP.
     */
    get(member: string | GuildMember | User, guild: string | Guild): number;
    /**
     * Sets the XP for specified user.
     * @fires Leveling#setTotalXP
     * @param {Number} totalXP Amount of total XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If set successfully: true, else: false.
     */
    set(totalXP: number, member: string | GuildMember | User, guild: string | Guild): boolean;
    /**
     * Adds the XP for specified user.
     * @fires Leveling#addTotalXP
     * @param {Number} totalXP Amount of total XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @param {Boolean} onMessage The value will be true if the method was called on 'messageCreate' bot event.
     * @returns {Boolean} If added successfully: true, else: false.
     */
    add(totalXP: number, member: string | GuildMember | User, guild: string | Guild, onMessage?: boolean): boolean;
    /**
     * Subtracts the XP for specified user.
     * @fires Leveling#subtractTotalXP
     * @param {Number} totalXP Amount of total XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If subtracted successfully: true, else: false.
     */
    subtract(totalXP: number, member: string | GuildMember | User, guild: string | Guild): boolean;
}
export = TotalXPManager;
