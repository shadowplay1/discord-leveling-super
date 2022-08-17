import { Guild, GuildMember, User } from 'discord.js'

import { LevelingOptions } from '../../typings/interfaces/LevelingOptions'

import Emitter from '../classes/Emitter'
import LevelingError from '../classes/LevelingError'

import DatabaseManager from './DatabaseManager'

import errors from '../structures/Errors'
import { LevelData } from '../../typings/interfaces/LevelData'

/**
 * Level manager methods class.
 * @extends {Emitter}
 */
class LevelManager extends Emitter {
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    public database: DatabaseManager

    /**
     * Leveling manager methods class.
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
     * @returns {Number} Amount of levels.
     */
    public get(member: string | GuildMember | User, guild: string | Guild): number {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const level: number = this.database.fetch(`${botGuild}.${user}.level`)
        return level
    }

    /**
     * Sets the XP for specified user.
     * @fires Leveling#setLevel
     * @param {Number} level Amount of levels.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If set successfully: true, else: false.
     */
    public set(level: number, member: string | GuildMember | User, guild: string | Guild): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const userLevelData: LevelData = this.database.fetch(`${botGuild}.${user}`)

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
        })

        return this.database.set(`${botGuild}.${user}.level`, level)
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
    public add(level: number, member: string | GuildMember | User, guild: string | Guild, onMessage: boolean = false): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const userData: LevelData = this.database.fetch(`${botGuild}.${user}`)

        if (!onMessage) this.emit('addLevel', {
            guildID: botGuild,
            userID: user,
            xp: userData.xp,
            totalXP: userData.totalXP,
            level: userData.level + level,
            maxXP: userData.maxXP,
            difference: userData.difference,
            multiplier: userData.multiplier,
            onMessage
        })

        return this.database.add(`${botGuild}.${user}.level`, level)
    }

    /**
     * Subtracts the XP for specified user.
     * @fires Leveling#subtractLevel
     * @param {Number} level Amount of levels.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If subtracted successfully: true, else: false.
     */
    public subtract(level: number, member: string | GuildMember | User, guild: string | Guild): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const userLevelData: LevelData = this.database.fetch(`${botGuild}.${user}`)

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
        })

        return this.database.subtract(`${botGuild}.${user}.level`, level)
    }
}

export = LevelManager