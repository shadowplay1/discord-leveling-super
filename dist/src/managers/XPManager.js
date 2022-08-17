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
 * XP manager methods class.
 * @extends {Emitter}
 */
class XPManager extends Emitter_1.default {
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    database;
    /**
     * XP manager methods class.
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
     * @returns {Number} Amount of XP.
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
        const xp = this.database.fetch(`${botGuild}.${user}.xp`);
        return xp;
    }
    /**
     * Sets the XP for specified user.
     * @fires Leveling#setXP
     * @param {Number} xp Amount of XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @param {Boolean} onMessage The value will be true if the method was called on 'messageCreate' bot event.
     * @returns {Boolean} If set successfully: true, else: false.
     */
    set(xp, member, guild, onMessage) {
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const userLevelData = this.database.fetch(`${botGuild}.${user}`);
        if (!onMessage)
            this.emit('setXP', {
                userData: userLevelData.userData,
                guildID: botGuild,
                userID: user,
                xp,
                totalXP: userLevelData.totalXP,
                level: userLevelData.level,
                maxXP: userLevelData.maxXP,
                difference: userLevelData.difference,
                multiplier: userLevelData.multiplier
            });
        return this.database.set(`${botGuild}.${user}.xp`, xp);
    }
    /**
     * Adds the XP for specified user.
     * @fires Leveling#addXP
     * @param {Number} xp Amount of XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @param {Boolean} onMessage The value will be true if the method was called on 'messageCreate' bot event.
     * @returns {Boolean} If added successfully: true, else: false.
     */
    add(xp, member, guild, onMessage = false) {
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const userData = this.database.fetch(`${botGuild}.${user}`);
        this.emit('addXP', {
            guildID: botGuild,
            userID: user,
            xp: userData.xp + xp,
            totalXP: userData.totalXP,
            level: userData.level,
            gainedXP: xp,
            maxXP: userData.maxXP,
            difference: userData.difference,
            multiplier: userData.multiplier,
            onMessage
        });
        return this.database.add(`${botGuild}.${user}.xp`, xp);
    }
    /**
     * Subtracts the XP for specified user.
     * @fires Leveling#subtractXP
     * @param {Number} xp Amount of XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If subtracted successfully: true, else: false.
     */
    subtract(xp, member, guild) {
        const isUser = member instanceof discord_js_1.GuildMember || member instanceof discord_js_1.User;
        const isGuild = guild instanceof discord_js_1.Guild;
        if (typeof member !== 'string' && !isUser)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.member + typeof member);
        if (typeof guild !== 'string' && !isGuild)
            throw new LevelingError_1.default(Errors_1.default.invalidTypes.guild + typeof guild);
        const user = isUser ? member.id : member.toString();
        const botGuild = isGuild ? guild.id : guild.toString();
        const userLevelData = this.database.fetch(`${botGuild}.${user}`);
        this.emit('subtractXP', {
            userData: userLevelData.userData,
            guildID: botGuild,
            userID: user,
            xp: userLevelData.xp - xp,
            totalXP: userLevelData.totalXP,
            level: userLevelData.level,
            maxXP: userLevelData.maxXP,
            difference: userLevelData.difference,
            multiplier: userLevelData.multiplier
        });
        return this.database.subtract(`${botGuild}.${user}.xp`, xp);
    }
}
module.exports = XPManager;
