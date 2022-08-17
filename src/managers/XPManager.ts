import { Guild, GuildMember, User } from 'discord.js'

import { LevelingOptions } from '../../typings/interfaces/LevelingOptions'

import Emitter from '../classes/Emitter'
import LevelingError from '../classes/LevelingError'

import DatabaseManager from './DatabaseManager'

import errors from '../structures/Errors'
import { LevelData } from '../../typings/interfaces/LevelData'

/**
 * XP manager methods class.
 * @extends {Emitter}
 */
class XPManager extends Emitter {

    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    private database: DatabaseManager

    /**
     * XP manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions) {
        super()
        this.database = new DatabaseManager(options)
    }

    /**
     * Gets the XP for specified user.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Number} Amount of XP.
     */
    public get(member: string | GuildMember | User, guild: string | Guild): number {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const xp: number = this.database.fetch(`${botGuild}.${user}.xp`)
        return xp
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
    public set(xp: number, member: string | GuildMember | User, guild: string | Guild, onMessage?: boolean): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const userLevelData: LevelData = this.database.fetch(`${botGuild}.${user}`)

        if (!onMessage) this.emit('setXP', {
            userData: userLevelData.userData,
            guildID: botGuild,
            userID: user,
            xp,
            totalXP: userLevelData.totalXP,
            level: userLevelData.level,
            maxXP: userLevelData.maxXP,
            difference: userLevelData.difference,
            multiplier: userLevelData.multiplier
        })

        return this.database.set(`${botGuild}.${user}.xp`, xp)
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
    public add(xp: number, member: string | GuildMember | User, guild: string | Guild, onMessage: boolean = false): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const userData: LevelData = this.database.fetch(`${botGuild}.${user}`)

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
        })

        return this.database.add(`${botGuild}.${user}.xp`, xp)
    }

    /**
     * Subtracts the XP for specified user.
     * @fires Leveling#subtractXP
     * @param {Number} xp Amount of XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If subtracted successfully: true, else: false.
     */
    public subtract(xp: number, member: string | GuildMember | User, guild: string | Guild): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const userLevelData: LevelData = this.database.fetch(`${botGuild}.${user}`)

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
        })

        return this.database.subtract(`${botGuild}.${user}.xp`, xp)
    }
}

export = XPManager