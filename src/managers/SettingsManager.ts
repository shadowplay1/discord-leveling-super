import { Client, Guild } from 'discord.js'

import { LevelingOptions } from '../../typings/interfaces/LevelingOptions'
import { SettingsArrays, SettingsTypes } from '../../typings/interfaces/Settings'

import LevelingError from '../classes/LevelingError'

import errors from '../structures/Errors'

import DatabaseManager from './DatabaseManager'
import UtilsManager from './UtilsManager'

const SettingsArray = [
    'xp',
    'maxXP',
    'multiplier',
    'status',
    'ignoredUsers',
    'lockedChannels',
    'ignoreBots',
    'filter'
]

/**
 * Settings manager methods class.
 */
class SettingsManager {

    /**
     * Leveling Options.
     * @type {LevelingOptions}
     * @private
     */
    private options: LevelingOptions


    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    private database: DatabaseManager

    /**
     * Utils Manager.
     * @type {UtilsManager}
     * @private
     */
    private utils: UtilsManager

    /**
     * Ranks manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions, client: Client) {
        this.options = options

        this.database = new DatabaseManager(options)
        this.utils = new UtilsManager(options, client)
    }

    /**
     * Gets the specified setting from the database.
     * 
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * options object or default options object.
     * 
     * @param {keyof SettingsTypes} key The setting to fetch.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes[K]} The setting from the database.
     */
    public get<K extends keyof SettingsTypes>(key: K, guild: string | Guild): SettingsTypes[K] {
        const isGuild = guild instanceof Guild

        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)
        if (!SettingsArray.includes(key)) throw new LevelingError(errors.settingsManager.invalidKey + key)

        const botGuild = isGuild ? (guild as Guild).id : guild.toString()
        const data = this.all(botGuild)

        const dbValue = data[key]
        return dbValue
    }

    /**
     * Changes the specified setting.
     * 
     * Note: If the server don't have any setting specified, 
     * the module will take the values from the 
     * options object or default options object.
     * 
     * @param {keyof SettingsTypes} key The setting to change.
     * @param {SettingsTypes[K]} value The value to set.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    public set<K extends keyof SettingsTypes>(key: K, value: SettingsTypes[K], guild: string | Guild): SettingsTypes {
        const isGuild = guild instanceof Guild

        if (value == undefined) throw new LevelingError(errors.invalidTypes.value + typeof value)
        if (typeof key !== 'string') throw new LevelingError(errors.databaseManager.invalidTypes.key + typeof key)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        if (!SettingsArray.includes(key)) throw new LevelingError(errors.settingsManager.invalidKey + key)

        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        if (key == 'filter') this.database.set(`${botGuild}.settings.${key}`, value.toString())
        else this.database.set(`${botGuild}.settings.${key}`, value)

        return this.all(botGuild)
    }

    /**
    * Pushes the element in a setting's array.
    * 
    * Note: If the server don't have any setting specified, 
    * the module will take the values from the 
    * options object or default options object.
    * 
    * @param {keyof SettingsArrays} key The setting to change.
    * @param {SettingsArrays[K]} value The value to set.
    * @param {String} guild Guild or it's ID.
    * @returns {SettingsTypes} The server settings object.
    */
    public push<K extends keyof SettingsArrays>(key: K, value: SettingsArrays[K], guild: string | Guild): SettingsTypes {
        const isGuild = guild instanceof Guild

        if (value == undefined) throw new LevelingError(errors.invalidTypes.value + typeof value)
        if (typeof key !== 'string') throw new LevelingError(errors.databaseManager.invalidTypes.key + typeof key)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        if (!SettingsArray.includes(key)) throw new LevelingError(errors.settingsManager.invalidKey + key)

        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const data = this.get(key, guild)
        const type = this.utils.typeOf(data)

        if (type !== 'Array') throw new LevelingError(errors.databaseManager.invalidTypes.target.array + type)

        this.database.push(`${botGuild}.settings.${key}`, value)
        return this.all(botGuild)
    }

    /**
    * Removes the element from a setting's array.
    * 
    * Note: If the server don't have any setting specified, 
    * the module will take the values from the 
    * options object or default options object.
    * 
    * @param {keyof SettingsArrays} key The setting to change.
    * @param {SettingsArrays[K]} value The value to remove.
    * @param {String} guild Guild or it's ID.
    * @returns {SettingsTypes} The server settings object.
    */
    public unpush<K extends keyof SettingsArrays>(key: K, value: any, guild: string | Guild): SettingsTypes {
        const isGuild = guild instanceof Guild

        if (typeof key !== 'string') throw new LevelingError(errors.databaseManager.invalidTypes.key + typeof key)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        if (!SettingsArray.includes(key)) throw new LevelingError(errors.settingsManager.invalidKey + key)

        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const data = this.get(key, guild)
        const index = data.indexOf(value)

        const type = this.utils.typeOf(data)
        if (type !== 'Array') throw new LevelingError(errors.databaseManager.invalidTypes.target.array + type)

        if (index == -1) throw new LevelingError(errors.settingsManager.valueNotFound(key, value))

        this.database.removeElement(`${botGuild}.settings.${key}`, index)
        return this.all(botGuild)
    }

    /**
     * Removes the specified setting.
     * 
     * Note: If the server don't have any setting specified, 
     * the module will take the values from the 
     * options object or default options object.
     * 
     * @param {keyof SettingsTypes} key The setting to remove.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    public remove<K extends keyof SettingsTypes>(key: K, guild: string | Guild): SettingsTypes {
        const isGuild = guild instanceof Guild

        if (typeof key !== 'string') throw new LevelingError(errors.databaseManager.invalidTypes.key + typeof key)
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        if (!SettingsArray.includes(key)) throw new LevelingError(errors.settingsManager.invalidKey + key)

        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        this.database.remove(`${botGuild}.settings.${key}`)
        return this.all(guild)
    }

    /**
     * Fetches the server's settings object.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    public all(guild: string | Guild): SettingsTypes {

        const isGuild = guild instanceof Guild
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const settings: SettingsTypes = this.database.fetch(`${botGuild}.settings`)

        return {
            xp: settings?.xp == null ? null : settings?.xp,
            maxXP: settings?.maxXP == null ? null : settings?.maxXP,

            multiplier: settings?.multiplier == null ? null : settings?.multiplier,

            status: settings?.status == null ? null : settings?.status,
            ignoreBots: settings?.ignoreBots == null ? null : settings?.ignoreBots,

            ignoredUsers: settings?.ignoredUsers == null ? null : settings?.ignoredUsers,
            lockedChannels: settings?.lockedChannels == null ? null : settings?.lockedChannels,

            filter: settings?.filter || null
        }
    }

    /**
     * Resets all the settings to setting that are in options object.
     * @param {String} guild Guild or it's ID.
     * @returns {SettingsTypes} The server settings object.
     */
    public reset(guild: string | Guild): SettingsTypes {
        const isGuild = guild instanceof Guild
        if (typeof guild !== 'string' && !isGuild) throw new LevelingError(errors.invalidTypes.guild + typeof guild)

        const botGuild = isGuild ? (guild as Guild).id : guild.toString()

        const defaultSettings = {
            xp: this.options.xp,
            maxXP: this.options.maxXP,

            multiplier: this.options.multiplier,

            status: this.options.status,
            ignoreBots: this.options.ignoreBots,

            ignoredUsers: this.options.ignoredUsers,
            lockedChannels: this.options.lockedChannels,

            filter: this.options.filter
        }

        this.database.set(`${botGuild}.settings`, defaultSettings)

        return defaultSettings
    }
}

export = SettingsManager