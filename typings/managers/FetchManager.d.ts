import { Guild, GuildMember, User } from 'discord.js';
import { LevelingOptions } from '../../typings/interfaces/LevelingOptions';
/**
 * Fetch manager methods class.
 */
declare class FetchManager {
    /**
     * Storage Path.
     * @type {String}
     * @private
     */
    private storagePath;
    /**
     * Fetch manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options?: LevelingOptions);
    /**
     * Gets the amount of XP for specified user.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Number} Amount of XP.
     */
    fetchXP(member: string | GuildMember | User, guild: string | Guild): number;
    /**
    * Gets the amount of total XP for specified user.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchTotalXP(member: string | GuildMember | User, guild: string | Guild): number;
    /**
    * Gets the amount of levels for specified user.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchLevels(member: string | GuildMember | User, guild: string | Guild): number;
    /**
    * Gets the amount of max XP for specified user.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchMaxXP(member: string | GuildMember | User, guild: string | Guild): number;
    /**
    * Gets the difference between max XP and user's XP.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchDifference(member: string | GuildMember | User, guild: string | Guild): number;
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    fetchAll(): object;
}
export = FetchManager;
