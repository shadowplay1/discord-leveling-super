"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const LevelingError_1 = __importDefault(require("../classes/LevelingError"));
const Errors_1 = __importDefault(require("../structures/Errors"));
const DatabaseManager_1 = __importDefault(require("./DatabaseManager"));
/**
 * Ranks manager methods class.
 */
class RanksManager {
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
     * Ranks manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options, client) {
        this.client = client;
        this.database = new DatabaseManager_1.default(options);
    }
    /**
    * Fetches the user's rank.
    * @param {String | GuildMember | User} member Member or it's ID
    * @param {String | Guild} guild Guild or it's ID
    * @returns {RankData} User's rank object.
    */
    get(member, guild) {
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const rank = this.database.fetch(`${botGuild}.${user}`);
        if (!rank)
            return {
                userData: null,
                xp: null,
                totalXP: null,
                multiplier: null,
                level: null,
                maxXP: null,
                difference: null,
            };
        return rank;
    }
    /**
     * Shows a level leaderboard for specified server.
     * @param {String | Guild} guild Guild or it's ID
     * @returns {LeaderboardData[]} Sorted leaderboard array.
     */
    leaderboard(guild) {
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const botGuild = isGuild ? guild.id : guild.toString();
        const serverData = this.database.fetch(`${botGuild}`);
        let leaderboard = [];
        if (!serverData)
            return [];
        let users = Object.keys(serverData);
        let ranks = Object.values(serverData);
        for (let i in users)
            leaderboard.push({
                userID: users[i],
                xp: ranks[i].xp,
                totalXP: ranks[i].totalXP,
                level: ranks[i].level,
                maxXP: ranks[i].maxXP,
                difference: ranks[i].difference,
                multiplier: ranks[i].multiplier,
                user: this.client.users.cache.get(users[i]),
                userData: ranks[i].userData
            });
        return leaderboard.sort((a, b) => b.totalXP - a.totalXP).filter(x => !isNaN(x.totalXP));
    }
    /**
    * Sets the multiplier for specified user.
    * @param {Number} multiplier The multimplier number to set.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Boolean} If set successfully: true; else: false
    */
    setMultiplier(multiplier, member, guild) {
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        if (isNaN(multiplier))
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.multiplier + typeof multiplier);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        return this.database.set(`${botGuild}.${user}.multiplier`, multiplier);
    }
}
module.exports = RanksManager;
