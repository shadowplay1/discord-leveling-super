import { Client, Guild, GuildMember, User } from 'discord.js'

import { LevelData } from '../../typings/interfaces/LevelData'
import { LevelingOptions } from '../../typings/interfaces/LevelingOptions'
import { RankData } from '../../typings/interfaces/RankData'
import { LeaderboardData } from '../../typings/interfaces/LeaderboardData'

import LevelingError from '../classes/LevelingError'

import errors from '../structures/Errors'

import DatabaseManager from './DatabaseManager'

/**
 * Ranks manager methods class.
 */
class RanksManager {

    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    private database: DatabaseManager

    /**
     * Discord Bot Client.
     * @type {Client}
     * @private
     */
    private client: Client

    /**
     * Ranks manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions, client: Client) {
        this.client = client
        this.database = new DatabaseManager(options)
    }

    /**
    * Fetches the user's rank.
    * @param {String | GuildMember | User} member Member or it's ID
    * @param {String | Guild} guild Guild or it's ID
    * @returns {RankData} User's rank object.
    */
    get(member: string | GuildMember | User, guild: string | Guild): RankData {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const rank = this.database.fetch(`${botGuild}.${user}`)

        if (!rank) return {
            userData: null,
            xp: null,
            totalXP: null,
            multiplier: null,
            level: null,
            maxXP: null,
            difference: null,
        }

        return rank
    }

    /**
     * Shows a level leaderboard for specified server.
     * @param {String | Guild} guild Guild or it's ID
     * @returns {LeaderboardData[]} Sorted leaderboard array.
     */
    public leaderboard(guild: string | Guild): LeaderboardData[] {
        const isGuild = guild instanceof Guild

        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const serverData: LevelData = this.database.fetch(`${botGuild}`)
        let leaderboard = []

        if (!serverData) return []

        let users = Object.keys(serverData)
        let ranks = Object.values(serverData)

        for (let i in users) leaderboard.push({
            userID: users[i],
            xp: ranks[i].xp,
            totalXP: ranks[i].totalXP,
            level: ranks[i].level,
            maxXP: ranks[i].maxXP,
            difference: ranks[i].difference,
            multiplier: ranks[i].multiplier,
            user: this.client.users.cache.get(users[i]),
            userData: ranks[i].userData
        })

        return leaderboard.sort((a, b) => b.totalXP - a.totalXP).filter(x => !isNaN(x.totalXP))
    }

    /**
    * Sets the multiplier for specified user.
    * @param {Number} multiplier The multimplier number to set.
    * @param {String | GuildMember | User} member Member or it's ID.
    * @param {String | Guild} guild Guild or it's ID.
    * @returns {Boolean} If set successfully: true; else: false
    */
    setMultiplier(multiplier: number, member: string | GuildMember | User, guild: string | Guild): boolean {
        const isUser = member instanceof GuildMember || member instanceof User
        const isGuild = guild instanceof Guild

        if (typeof member !== 'string' && !isUser) throw new LevelingError(errors.invalidTypes.member + typeof member)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        if (isNaN(multiplier)) throw new LevelingError(errors.invalidTypes.multiplier + typeof multiplier)

        const user = isUser ? (member as User).id : member.toString()
        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        return this.database.set(`${botGuild}.${user}.multiplier`, multiplier)
    }
}

export = RanksManager