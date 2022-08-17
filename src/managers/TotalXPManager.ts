import { Guild, GuildMember, User } from 'discord.js'

import { LevelingOptions } from '../../typings/interfaces/LevelingOptions'

import Emitter from '../classes/Emitter'
import LevelingError from '../classes/LevelingError'

import DatabaseManager from './DatabaseManager'

import errors from '../structures/Errors'
import { LevelData } from '../../typings/interfaces/LevelData'

/**
 * Total XP manager methods class.
 * @extends {Emitter}
 */
class TotalXPManager extends Emitter {
    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    private database: DatabaseManager

    /**
     * Total XP manager methods class.
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
     * @returns {Number} Amount of total XP.
     */
    public get(member: string | GuildMember | User, guild: string | Guild): number {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const totalXP: number = this.database.fetch(`${botGuild}.${user}.totalXP`)
        return totalXP
    }

    /**
     * Sets the XP for specified user.
     * @fires Leveling#setTotalXP
     * @param {Number} totalXP Amount of total XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If set successfully: true, else: false.
     */
    public set(totalXP: number, member: string | GuildMember | User, guild: string | Guild): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const userLevelData: LevelData = this.database.fetch(`${botGuild}.${user}`)

        this.emit('setTotalXP', {
            userData: userLevelData.userData,
            guildID: botGuild,
            userID: user,
            xp: userLevelData.xp,
            level: userLevelData.level,
            totalXP,
            maxXP: userLevelData.maxXP,
            difference: userLevelData.difference,
            multiplier: userLevelData.multiplier
        })

        return this.database.set(`${botGuild}.${user}.totalXP`, totalXP)
    }

    /**
     * Adds the XP for specified user.
     * @fires Leveling#addTotalXP
     * @param {Number} totalXP Amount of total XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @param {Boolean} onMessage The value will be true if the method was called on 'messageCreate' bot event.
     * @returns {Boolean} If added successfully: true, else: false.
     */
    public add(totalXP: number, member: string | GuildMember | User, guild: string | Guild, onMessage: boolean = false): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const userData: LevelData = this.database.fetch(`${botGuild}.${user}`)

        this.emit('addTotalXP', {
            guildID: botGuild,
            userID: user,
            xp: userData.xp,
            level: userData.level,
            gainedXP: totalXP,
            totalXP: userData.totalXP + totalXP,
            maxXP: userData.maxXP,
            difference: userData.difference,
            multiplier: userData.multiplier,
            onMessage
        })

        return this.database.add(`${botGuild}.${user}.totalXP`, totalXP)
    }

    /**
     * Subtracts the XP for specified user.
     * @fires Leveling#subtractTotalXP
     * @param {Number} totalXP Amount of total XP.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Boolean} If subtracted successfully: true, else: false.
     */
    public subtract(totalXP: number, member: string | GuildMember | User, guild: string | Guild): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const userLevelData: LevelData = this.database.fetch(`${botGuild}.${user}`)

        this.emit('subtractTotalXP', {
            userData: userLevelData.userData,
            guildID: botGuild,
            userID: user,
            xp: userLevelData.xp,
            level: userLevelData.level,
            totalXP: userLevelData.totalXP - totalXP,
            maxXP: userLevelData.maxXP,
            difference: userLevelData.difference,
            multiplier: userLevelData.multiplier
        })

        return this.database.subtract(`${botGuild}.${user}.totalXP`, totalXP)
    }
}

export = TotalXPManager