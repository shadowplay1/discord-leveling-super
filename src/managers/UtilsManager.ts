import fetch from 'node-fetch'
import { readFileSync, writeFileSync } from 'fs'
import { Client } from 'discord.js'

import CheckerOptions from '../../typings/interfaces/CheckerOptions'
import { LevelingOptions } from '../../typings/interfaces/LevelingOptions'

import { UpdateData } from '../../typings/interfaces/UpdateData'
import { LevelData } from '../../typings/interfaces/LevelData'

import DefaultOptions from '../structures/DefaultOptions'

import FetchManager from './FetchManager'
import DatabaseManager from './DatabaseManager'

import DefaultObject from '../structures/DefaultObject'
import { RankData } from '../../typings/interfaces/RankData'

/**
 * Utils manager methods class.
 */
class UtilsManager {

    /**
     * Fetch Manager.
     * @type {FetchManager}
     * @private
     */
    private fetcher: FetchManager

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
     * Leveling Options.
     * @type {LevelingOptions}
     * @private
     */
    private options: LevelingOptions

    /**
     * Utils manager methods class.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(options: LevelingOptions, client?: Client) {
        this.options = options

        this.client = client

        this.database = new DatabaseManager(options)
        this.fetcher = new FetchManager(options)
    }

    /**
    * Checks for if the module is up to date.
    * @returns {Promise<VersionData>} This method will show is the module updated, latest version and installed version.
    */
    public async checkUpdates(): Promise<UpdateData> {
        const version = require('../../package.json').version

        const packageData = await fetch('https://registry.npmjs.com/discord-leveling-super')
            .then((text: { json: () => any }) => text.json())

        if (version == packageData['dist-tags'].latest) return {
            updated: true,
            installedVersion: version,
            packageVersion: packageData['dist-tags'].latest
        }

        return {
            updated: false,
            installedVersion: version,
            packageVersion: packageData['dist-tags'].latest
        }
    }

    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    public all(): object {
        return this.fetcher.fetchAll()
    }

    /**
     * Writes the data to file.
     * @param {String} path File path to write.
     * @param {any} data Any data to write
     * @returns {Boolean} If successfully written: true; else: false.
     */
    public write(path: string, data: any): boolean {
        if (!path) return false
        if (!data) return false

        const fileData = readFileSync(path).toString()
        if (fileData == data) return false

        writeFileSync(this.options.storagePath || './leveling.json', JSON.stringify(data, null, '\t'))
        return true
    }

    /**
     * Clears the storage file.
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    public clearStorage(): boolean {
        const data = this.all()
        const stringData = String(data)

        if (stringData == '{}') return false

        this.write(this.options.storagePath || './leveling.json', '{}')
        return true
    }

    /**
    * Fully removes the guild from database.
    * @param {String} guildID Guild ID
    * @returns {Boolean} If cleared successfully: true; else: false
    */
    public removeGuild(guildID: string): boolean {
        const data = this.fetcher.fetchAll()
        const guild = data[guildID]

        if (!guildID) return false
        if (!guild) return false

        this.database.remove(guildID)
        return true
    }

    /**
     * Removes the user from database.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    public removeUser(memberID: string, guildID: string): boolean {
        const data = this.fetcher.fetchAll()

        const guild = data[guildID]
        const user = guild?.[memberID]

        if (!guildID) return false
        if (!guild) return false
        if (!user) return false

        this.database.remove(`${guildID}.${memberID}`)
        return true
    }

    /**
     * Sets the default user object for the specified member.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @param {RankData} object Custom rank object to set.
     * @returns {Boolean} If reset is successful: true; else: false.
     */
    public reset(memberID: string, guildID: string, object?: RankData): boolean {
        const dataObject = DefaultObject

        if (!guildID) return false
        if (!memberID) return false

        if (object) return this.database.set(`${guildID}.${memberID}`, object)

        const user = this.client.users.cache.get(memberID)
        if (!user) return false

        dataObject.userData = {
            id: memberID,
            username: user.username,
            tag: user.tag,
            discriminator: user.discriminator
        }

        dataObject.xp = 0
        dataObject.totalXP = 0

        return this.database.set(`${guildID}.${memberID}`, dataObject)
    }

    /**
     * Returns a rank object with specified values.
     * @param {LevelData} options Rank object to use.
     * @returns {LevelData} Rank object with specified values.
     */
    public getRankObject(options?: LevelData): LevelData {
        const isDefined = (val: any) => val !== undefined ? val : false

        if (!options) return {
            userData: null,
            guildID: null,
            userID: null,
            xp: null,
            totalXP: null,
            level: null,
            maxXP: null,
            difference: null,
            multiplier: null
        }

        return {
            userData: isDefined(options.userData) || null,
            guildID: isDefined(options.guildID) || null,
            userID: isDefined(options.userID) || null,
            xp: isDefined(options.xp) || null,
            totalXP: isDefined(options.totalXP) || null,
            level: isDefined(options.level) || null,
            maxXP: isDefined(options.maxXP) || null,
            difference: isDefined(options.difference) || null,
            multiplier: isDefined(options.multiplier) || null
        }
    }

    /**
     * Returns the type or instance of specified item.
     * @param {any} item The item to get the type of.
     * @returns {String} Type or instance of the item.
     */
    public typeOf(item: any): string {
        return item === null ?
            'null' :
            item === undefined ?
                'undefined' :
                item.constructor.name && item.name
                    ? item.name :
                    item.constructor.name
    }

    /**
    * Checks for is the item object and returns it.
    * @param {any} item The item to check.
    * @returns {Boolean} Is the item object or not.
    */
    public isObject(item: any): boolean {
        return !Array.isArray(item)
            && typeof item == 'object'
            && item !== null
    }

    /**
     * Checks the Leveling options object, fixes the problems in it and returns the fixed options object.
     * @param {CheckerOptions} options Option checker options.
     * @param {LevelingOptions} levelingOptions Leveling options object to check.
     * @returns {LevelingOptions} Fixed Leveling options object.
    */
    public checkOptions(options: CheckerOptions = {}, levelingOptions: LevelingOptions): LevelingOptions {
        const unset = (obj: object, key: String) => {
            const keys = key.split('.')
            let tmp = obj

            for (let i = 0; i < keys.length; i++) {
                if ((keys.length - 1) == i) {
                    delete tmp[keys[i]]

                } else if (!this.isObject(tmp[keys[i]])) {
                    tmp[keys[i]] = {}
                }

                tmp = tmp[keys[i]]
            }
        }

        let problems = []
        let output = {}

        const keys = Object.keys(DefaultOptions)
        const optionKeys = Object.keys(levelingOptions || {})

        if (typeof levelingOptions !== 'object' && !Array.isArray(levelingOptions)) {
            problems.push('options is not an object. Received type: ' + typeof levelingOptions)
            output = DefaultOptions
        } else {
            if (!optionKeys.length) {
                problems.push('options object is empty.')
                return DefaultOptions
            }
            for (let i of keys) {
                if (levelingOptions[i] == undefined) {
                    output[i] = DefaultOptions[i]
                    if (!options.ignoreUnspecifiedOptions) problems.push(`options.${i} is not specified.`)
                }

                else {
                    output[i] = levelingOptions[i]
                }

                for (let y of Object.keys(DefaultOptions[i])) {

                    if (levelingOptions[i]?.[y] == undefined || output[i]?.[y] == undefined) {
                        try {
                            output[i][y] = DefaultOptions[i][y]
                        } catch (_) { }

                        if (!options.ignoreUnspecifiedOptions && isNaN(Number(y))) problems.push(`options.${i}.${y} is not specified.`)
                    }

                    else { }
                }

                if (typeof output[i] !== typeof DefaultOptions[i]) {
                    if (!options.ignoreInvalidTypes) {
                        if (i == 'xp') {
                            if (typeof output[i] !== 'number' && !Array.isArray(output[i])) {
                                problems.push(`options.${i} is not a ${i == 'xp' ? 'number or array' : typeof DefaultOptions[i]}. Received type: ${typeof output[i]}.`)
                                output[i] = DefaultOptions[i]
                            }

                        } else {
                            problems.push(`options.${i} is not a ${typeof DefaultOptions[i]}. Received type: ${typeof output[i]}.`)
                            output[i] = DefaultOptions[i]
                        }
                    }
                }

                else { }

                for (let y of Object.keys(DefaultOptions[i])) {

                    if (typeof output[i]?.[y] !== typeof DefaultOptions[i][y]) {
                        if (!options.ignoreInvalidTypes) problems.push(`options.${i}.${y} is not a ${typeof DefaultOptions[i][y]}. Received type: ${typeof output[i][y]}.`)
                        output[i][y] = DefaultOptions[i][y]
                    }

                    else { }
                }
            }

            for (let i of optionKeys) {
                const defaultIndex = keys.indexOf(i)
                const objectKeys = Object.keys(levelingOptions?.[i])

                for (let y of objectKeys) {
                    const allKeys = Object.keys(DefaultOptions[i] || '0')
                    const index = allKeys.indexOf(y)

                    if (!allKeys[index] && isNaN(Number(y))) {
                        problems.push(`options.${i}.${y} is an invalid option.`)
                        unset(output, `${i}.${y}`)
                    }
                }

                if (!keys[defaultIndex]) {
                    unset(output, i)
                    problems.push(`options.${i} is an invalid option.`)
                }

            }
        }


        if (options.sendLog) {
            if (options.showProblems) console.log(`Checked the options: ${problems.length ?
                `${problems.length} problems found:\n\n${problems.join('\n')}` : '0 problems found.'}`)

            if (options.sendSuccessLog && !options.showProblems) console.log(`Checked the options: ${problems.length} ${problems.length == 1 ? 'problem' : 'problems'} found.`)
        }

        if (output == DefaultOptions) return levelingOptions
        else return output
    }
}

export = UtilsManager