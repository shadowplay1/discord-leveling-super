"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const Emitter_1 = __importDefault(require("../classes/Emitter"));
const LevelingError_1 = __importDefault(require("../classes/LevelingError"));
const DatabaseManager_1 = __importDefault(require("./DatabaseManager"));
const Errors_1 = __importDefault(require("../structures/Errors"));
/**
 * Level manager methods class.
 * @extends {Emitter}
 */
class LevelManager extends Emitter_1.default {
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    database;
    /**
     * Leveling manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options) {
        super();
        this.database = new DatabaseManager_1.default(options);
    }
    /**
     * Gets the XP for specified user.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Number} Amount of levels.
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
        const level = this.database.fetch(`${botGuild}.${user}.level`);
        return level;
    }
    /**
     * Sets the XP for specified user.
     * @fires Leveling#setLevel
     * @param {Number} level Amount of levels.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If set successfully: true, else: false.
     */
    set(level, member, guild) {
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const userLevelData = this.database.fetch(`${botGuild}.${user}`);
        this.emit('setLevel', {
            userData: userLevelData.userData,
            guildID: botGuild,
            userID: user,
            xp: userLevelData.xp,
            totalXP: userLevelData.totalXP,
            level,
            maxXP: userLevelData.maxXP,
            difference: userLevelData.difference,
            multiplier: userLevelData.multiplier
        });
        return this.database.set(`${botGuild}.${user}.level`, level);
    }
    /**
     * Adds the XP for specified user.
     * @fires Leveling#addLevel
     * @param {Number} level Amount of levels.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @param {Boolean} onMessage The value will be true if the method was called on 'messageCreate' bot event.
     * @returns {Boolean} If added successfully: true, else: false.
     */
    add(level, member, guild, onMessage = false) {
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const userData = this.database.fetch(`${botGuild}.${user}`);
        if (!onMessage)
            this.emit('addLevel', {
                guildID: botGuild,
                userID: user,
                xp: userData.xp,
                totalXP: userData.totalXP,
                level: userData.level + level,
                maxXP: userData.maxXP,
                difference: userData.difference,
                multiplier: userData.multiplier,
                onMessage
            });
        return this.database.add(`${botGuild}.${user}.level`, level);
    }
    /**
     * Subtracts the XP for specified user.
     * @fires Leveling#subtractLevel
     * @param {Number} level Amount of levels.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If subtracted successfully: true, else: false.
     */
    subtract(level, member, guild) {
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const userLevelData = this.database.fetch(`${botGuild}.${user}`);
        this.emit('subtractLevel', {
            userData: userLevelData.userData,
            guildID: botGuild,
            userID: user,
            xp: userLevelData.xp,
            totalXP: userLevelData.totalXP,
            level: userLevelData.level - level,
            maxXP: userLevelData.maxXP,
            difference: userLevelData.difference,
            multiplier: userLevelData.multiplier
        });
        return this.database.subtract(`${botGuild}.${user}.level`, level);
    }
}
module.exports = LevelManager;
