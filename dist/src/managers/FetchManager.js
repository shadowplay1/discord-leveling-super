"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = require("fs");
const discord_js_1 = require("discord.js");
const Errors_1 = __importDefault(require("../structures/Errors"));
const LevelingError_1 = __importDefault(require("../classes/LevelingError"));
/**
 * Fetch manager methods class.
 */
class FetchManager {
    /**
     * Storage Path.
     * @type {String}
     * @private
     */
    storagePath;
    /**
     * Fetch manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options = {}) {
        this.storagePath = options.storagePath || './leveling.json';
    }
    /**
     * Gets the amount of XP for specified user.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Number} Amount of XP.
     */
    fetchXP(member, guild) {
        const data = this.fetchAll();
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const guildData = data[botGuild];
        const memberData = guildData?.[user];
        const xp = memberData?.xp;
        return (xp || 0);
    }
    /**
    * Gets the amount of total XP for specified user.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchTotalXP(member, guild) {
        const data = this.fetchAll();
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const guildData = data[botGuild];
        const memberData = guildData?.[user];
        const totalXP = memberData?.totalXP;
        return (totalXP || 0);
    }
    /**
    * Gets the amount of levels for specified user.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchLevels(member, guild) {
        const data = this.fetchAll();
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const guildData = data[botGuild];
        const memberData = guildData?.[user];
        const levels = memberData?.level;
        return (levels || 0);
    }
    /**
    * Gets the amount of max XP for specified user.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchMaxXP(member, guild) {
        const data = this.fetchAll();
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const guildData = data[botGuild];
        const memberData = guildData?.[user];
        const maxXP = memberData?.maxXP;
        return (maxXP || 0);
    }
    /**
    * Gets the difference between max XP and user's XP.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchDifference(member, guild) {
        const data = this.fetchAll();
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const guildData = data[botGuild];
        const memberData = guildData?.[user];
        const difference = memberData?.difference;
        return (difference || 0);
    }
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    fetchAll() {
        const isFileExisting = (0, fs_1.existsSync)(this.storagePath);
        if (!isFileExisting)
            (0, fs_1.writeFileSync)(this.storagePath, '{}');
        const fileData = (0, fs_1.readFileSync)(this.storagePath);
        const stringData = fileData.toString();
        return JSON.parse(stringData);
    }
}
module.exports = FetchManager;
