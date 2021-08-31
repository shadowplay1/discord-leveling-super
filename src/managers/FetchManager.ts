import { readFileSync, writeFileSync, existsSync } from 'fs'
import { Guild, GuildMember, User } from 'discord.js'

import { RankObject } from '../../typings/interfaces/RankObject'
import { LevelingOptions } from '../../typings/interfaces/LevelingOptions'

import errors from '../structures/Errors'

import LevelingError from '../classes/LevelingError'

/**
 * Fetch manager methods class.
 */
class FetchManager {

    /**
     * Storage Path.
     * @type {String}
     * @private
     */
    private storagePath: string

    /**
     * Fetch manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions = {}) {
        this.storagePath = options.storagePath || './leveling.json'
    }

    /**
     * Gets the amount of XP for specified user.
     * @param {String | GuildMember | User} member Member or it's ID.
     * @param {String | Guild} guild Guild or it's ID.
     * @returns {Number} Amount of XP.
     */
    fetchXP(member: string | GuildMember | User, guild: string | Guild): number {
        const data = this.fetchAll()

        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const guildData = data[botGuild]
        const memberData: RankObject = guildData?.[user]

        const xp = memberData?.xp

        return (xp || 0)
    }

    /**
    * Gets the amount of total XP for specified user.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchTotalXP(member: string | GuildMember | User, guild: string | Guild): number {
        const data = this.fetchAll()

        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const guildData = data[botGuild]
        const memberData: RankObject = guildData?.[user]

        const totalXP = memberData?.totalXP

        return (totalXP || 0)
    }

    /**
    * Gets the amount of levels for specified user.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchLevels(member: string | GuildMember | User, guild: string | Guild): number {
        const data = this.fetchAll()

        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const guildData = data[botGuild]
        const memberData: RankObject = guildData?.[user]

        const levels = memberData?.level

        return (levels || 0)
    }

    /**
    * Gets the amount of max XP for specified user.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchMaxXP(member: string | GuildMember | User, guild: string | Guild): number {
        const data = this.fetchAll()

        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const guildData = data[botGuild]
        const memberData: RankObject = guildData?.[user]

        const maxXP = memberData?.maxXP

        return (maxXP || 0)
    }

    /**
    * Gets the difference between max XP and user's XP.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Number} Amount of XP.
    */
    fetchDifference(member: string | GuildMember | User, guild: string | Guild): number {
        const data = this.fetchAll()

        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const guildData = data[botGuild]
        const memberData: RankObject = guildData?.[user]

        const difference = memberData?.difference

        return (difference || 0)
    }

    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    fetchAll(): object {
        const isFileExisting = existsSync(this.storagePath)

        if (!isFileExisting) writeFileSync(this.storagePath, '{}')

        const fileData = readFileSync(this.storagePath)
        const stringData = fileData.toString()

        return JSON.parse(stringData)
    }
}

export = FetchManager