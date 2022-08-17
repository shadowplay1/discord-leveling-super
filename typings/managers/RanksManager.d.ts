import { Client, Guild, GuildMember, User } from 'discord.js';
import { LevelingOptions } from '../../typings/interfaces/LevelingOptions';
import { RankData } from '../../typings/interfaces/RankData';
import { LeaderboardData } from '../../typings/interfaces/LeaderboardData';
/**
 * Ranks manager methods class.
 */
declare class RanksManager {
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    private database;
    /**
     * Discord Bot Client.
     * @type {Client}
     * @private
     */
    private client;
    /**
     * Ranks manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions, client: Client);
    /**
    * Fetches the user's rank.
    * @param {String | GuildMember | User} member Member or it's ID
    * @param {String | Guild} guild Guild or it's ID
    * @returns {RankData} User's rank object.
    */
    get(member: string | GuildMember | User, guild: string | Guild): RankData;
    /**
     * Shows a level leaderboard for specified server.
     * @param {String | Guild} guild Guild or it's ID
     * @returns {LeaderboardData[]} Sorted leaderboard array.
     */
    leaderboard(guild: string | Guild): LeaderboardData[];
    /**
    * Sets the multiplier for specified user.
    * @param {Number} multiplier The multimplier number to set.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Boolean} If set successfully: true; else: false
    */
    setMultiplier(multiplier: number, member: string | GuildMember | User, guild: string | Guild): boolean;
}
export = RanksManager;
