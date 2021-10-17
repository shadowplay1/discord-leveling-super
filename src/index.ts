import { promisify } from 'util'
import { readFileSync, writeFileSync, existsSync } from 'fs'

import {
    Client, MessageAttachment, MessageEmbed,
    Channel, MessagePayload, MessageOptions,
    TextChannel
} from 'discord.js'

import Emitter from './classes/Emitter'
import LevelingError from './classes/LevelingError'

import errors from './structures/Errors'
import DefaultObject from './structures/DefaultObject'

import { LevelingOptions } from '../typings/interfaces/LevelingOptions'
import { RankObject } from '../typings/interfaces/RankObject'
import { SettingsTypes } from '../typings/interfaces/Settings'

import UtilsManager from './managers/UtilsManager'
import DatabaseManager from './managers/DatabaseManager'
import FetchManager from './managers/FetchManager'
import RanksManager from './managers/RanksManager'

import XPManager from './managers/XPManager'
import LevelManager from './managers/LevelManager'
import TotalXPManager from './managers/TotalXPManager'
import SettingsManager from './managers/SettingsManager'

import modulePackage from '../package.json'

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
}

/**
 * The Leveling class.
 * @extends {Emitter}
 */
class Leveling extends Emitter {

    /**
     * Leveling options object.
     * @type {LevelingOptions}
     */
    public options: LevelingOptions

    /**
     * Discord Bot Client
     * @type {Client}
     */
    public client: Client


    /**
     * Module ready status.
     * @type {Boolean}
     */
    public ready: boolean

    /**
     * Module errored status.
     * @type {Boolean}
     */
    public errored: boolean


    /**
     * Database checking interval.
     * @type {NodeJS.Timeout}
     */
    public interval: NodeJS.Timeout


    /**
    * Leveling error class.
    * @type {LevelingError}
    */
    public LevelingError: typeof LevelingError

    /**
     * Utils manager methods object.
     * @type {UtilsManager}
     */
    public utils: UtilsManager

    /**
     * Module version.
     * @type {String}
     */
    public version: string

    /**
     * Link to the module's documentation website.
     * @type {String}
     */
    public docs: string


    /**
    * Database manager methods object.
    * @type {DatabaseManager}
    */
    public database: DatabaseManager

    /**
    * XP manager methods object.
    * @type {FetchManager}
    */
    public fetcher: FetchManager

    /**
     * Settings manager methods class.
     * @type {SettingsManager}
     */
    public settings: SettingsManager


    /**
    * XP manager methods object.
    * @type {XPManager}
    */
    public xp: XPManager

    /**
    * Level manager methods object.
    * @type {LevelManager}
    */
    public levels: LevelManager

    /**
    * Total XP manager methods object.
    * @type {LevelManager}
    */
    public totalXP: TotalXPManager

    /**
    * Ranks manager methods object.
    * @type {RanksManager}
    */
    public ranks: RanksManager

    /**
     * The Leveling class.
     * @param {Client} client Discord Bot Client.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(client: Client, options: LevelingOptions = {}) {
        super()

        this.LevelingError = LevelingError
        this.utils = new UtilsManager(options, client)

        this.options = this.utils.checkOptions(options.optionsChecker, options || {})
        this.client = client

        this.ready = false
        this.errored = false
        this.interval = null

        this.version = modulePackage.version
        this.docs = 'https://dls-docs.tk'

        this.database = null
        this.fetcher = null

        this.settings = null

        this.xp = null
        this.levels = null
        this.totalXP = null

        this.ranks = null

        this.init()
    }

    /**
    * Kills the Leveling instance.
    * @fires Leveling#destroy
    * @returns {Leveling | boolean} Leveling instance.
    */
    kill(): Leveling | boolean {
        if (!this.ready) return false

        clearInterval(this.interval)
        this.ready = false

        this.LevelingError = null
        this.interval = null

        this.utils = null
        this.database = null
        this.fetcher = null

        this.settings = null

        this.xp = null
        this.levels = null
        this.totalXP = null

        this.ranks = null

        this.emit('destroy')
        return this
    }

    /**
    * Starts the module.
    * @fires Leveling#ready
    * @returns {Promise<Boolean>} If started successfully: true; else: Error instance.
    */
    init(): Promise<boolean | void> {
        let attempt = 0
        let attempts = this.options?.errorHandler?.attempts == 0 ? Infinity : this.options?.errorHandler?.attempts

        const time = this.options?.errorHandler?.time
        const retryingTime = (time / 1000).toFixed(1)

        const sleep = promisify(setTimeout);

        const check = () => new Promise(resolve => {
            this._init().then(x => {

                if (x) {
                    this.errored = false
                    this.ready = true
                    return console.log(`${colors.green}Started successfully! :)`)
                }

                resolve(x)
            }).catch(err => resolve(err))
        })

        return this.options?.errorHandler?.handleErrors ? this._init().catch(async err => {
            if (!(err instanceof LevelingError)) this.errored = true

            console.log(`${colors.red}Failed to start the module:${colors.cyan}`)
            console.log(err)

            if (err.message.includes('This module is supporting only Node.js v14 or newer.')) process.exit(1)
            else console.log(`${colors.magenta}Retrying in ${retryingTime} seconds...${colors.reset}`)

            while (attempt < attempts && attempt !== -1) {
                await sleep(time)

                if (attempt < attempts) check().then(async (res: any) => {
                    if (res.message) {

                        attempt++

                        console.log(`${colors.red}Failed to start the module:${colors.cyan}`)
                        console.log(err)
                        console.log(`\x1b[34mAttempt ${attempt}${attempts == Infinity ? '.' : `/${attempts}`}`)

                        if (attempt == attempts) {
                            console.log(`${colors.green}Failed to start the module within ${attempts} attempts...${colors.reset}`)
                            process.exit(1)
                        }

                        console.log(`${colors.magenta}Retrying in ${retryingTime} seconds...`)
                        await sleep(time)

                    } else attempt = -1
                })
            }
        }) : this._init()
    }

    /**
     * Initializates the module.
     * @returns {Promise<boolean>} If started successfully: true; else: Error instance.
     * @private
     */
    _init(): Promise<boolean> {
        const storagePath = this.options.storagePath || './leveling.json'
        const updateCountdown = this.options.updateCountdown
        const isFileExist = existsSync(storagePath)

        return new Promise(async (resolve, reject) => {
            try {
                if (!this.client) return reject(new LevelingError(errors.noClient))
                if (this.errored) return
                if (this.ready) return

                if (this.options?.checkStorage) {
                    if (!isFileExist) writeFileSync(storagePath, '{}')

                    try {
                        if (storagePath.endsWith('package.json')) return reject(new LevelingError(errors.reservedName('package.json')))
                        if (storagePath.endsWith('package-lock.json')) return reject(new LevelingError(errors.reservedName('package-lock.json')))

                        const data = readFileSync(storagePath)
                        JSON.parse(data.toString())

                    } catch (err) {
                        if (err.message.includes('Unexpected') && err.message.includes('JSON')) return reject(new LevelingError(errors.wrongStorageData))
                        else reject(err)
                    }
                }

                if (this.options.updater?.checkUpdates) {
                    const version = await this.utils.checkUpdates()

                    if (!version.updated) {

                        console.log('\n\n')
                        console.log(colors.green + '╔═══════════════════════════════════════════════════════════╗')
                        console.log(colors.green + '║ @ discord-leveling-super                           - [] X ║')
                        console.log(colors.green + '║═══════════════════════════════════════════════════════════║')
                        console.log(colors.yellow + `║                  The module is ${colors.red}out of date!${colors.yellow}               ║`)
                        console.log(colors.magenta + '║                   New version is available!               ║')
                        console.log(colors.blue + `║                        ${version.installedVersion} --> ${version.packageVersion}                    ║`)
                        console.log(colors.cyan + '║          Run "npm i discord-leveling-super@latest"        ║')
                        console.log(colors.cyan + '║                         to update!                        ║')
                        console.log(colors.white + '║                View the full changelog here:              ║')
                        console.log(colors.red + '║  https://dls-docs.tk/#/docs/main/stable/general/changelog ║')
                        console.log(colors.green + '╚═══════════════════════════════════════════════════════════╝\x1b[37m')
                        console.log('\n\n')

                    } else {
                        if (this.options?.updater?.upToDateMessage) {

                            console.log('\n\n')
                            console.log(colors.green + '╔═══════════════════════════════════════════════════════════╗')
                            console.log(colors.green + '║ @ discord-leveling-super                           - [] X ║')
                            console.log(colors.green + '║═══════════════════════════════════════════════════════════║')
                            console.log(colors.yellow + `║                   The module is ${colors.cyan}up of date!${colors.yellow}               ║`)
                            console.log(colors.magenta + '║                   No updates are available.               ║')
                            console.log(colors.blue + `║                   Current version is ${version.packageVersion}.               ║`)
                            console.log(colors.cyan + '║                            Enjoy!                         ║')
                            console.log(colors.white + '║                View the full changelog here:              ║')
                            console.log(colors.red + '║  https://dls-docs.tk/#/docs/main/stable/general/changelog ║')
                            console.log(colors.green + '╚═══════════════════════════════════════════════════════════╝\x1b[37m')
                            console.log('\n\n')

                        }
                    }
                }

                if (this.options?.checkStorage == undefined ? true : this.options?.checkStorage) {
                    const storageExists = existsSync(storagePath)

                    const interval = setInterval(() => {
                        if (!storageExists) {
                            try {
                                if (storagePath?.endsWith('package.json')) throw new LevelingError(errors.reservedName('package.json'))
                                if (storagePath?.endsWith('package-lock.json')) throw new LevelingError(errors.reservedName('package-lock.json'))

                                writeFileSync(storagePath, '{}', 'utf-8')
                            } catch (err) {
                                throw new LevelingError(errors.notReady)
                            }
                            console.log(`${colors.red}failed to find a database file; created another one...${colors.reset}`)
                        }

                        try {
                            if (!storageExists) writeFileSync(storagePath, '{}', 'utf-8')

                            const data = readFileSync(storagePath)
                            JSON.parse(data.toString())

                        } catch (err) {
                            if (err.message.includes('Unexpected token') ||
                                err.message.includes('Unexpected end')) reject(new LevelingError(errors.wrongStorageData))

                            else {
                                reject(err)
                                throw err
                            }
                        }

                    }, updateCountdown)
                    this.interval = interval
                }

                this.start()
                this.ready = true
                this.emit('ready', undefined)

                return resolve(true)

            } catch (err) {
                this.errored = true
                reject(err)
            }
        })
    }

    /**
     * Starts all the managers.
     * @returns {Boolean} If successfully started: true.
     * @private
     */
    start(): boolean {
        this.utils = new UtilsManager(this.options, this.client)
        this.database = new DatabaseManager(this.options)
        this.fetcher = new FetchManager(this.options)

        this.settings = new SettingsManager(this.options, this.client)

        this.xp = new XPManager(this.options)
        this.levels = new LevelManager(this.options)
        this.totalXP = new TotalXPManager(this.options)

        this.ranks = new RanksManager(this.options, this.client)

        if(!this.client.on) {
            console.log(new LevelingError(errors.invalidClient))
            process.exit(1)
        }

        this.client.on('messageCreate', async message => {
            if (this.ready) {
                const data = this.fetcher.fetchAll()

                const guildID = message.guild.id
                const memberID = message.author.id

                const settings = {
                    xp: this.settings.get('xp', guildID),
                    maxXP: this.settings.get('maxXP', guildID),
                    multiplier: this.settings.get('multiplier', guildID),

                    status: this.settings.get('status', guildID),
                    ignoreBots: this.settings.get('ignoreBots', guildID),

                    lockedChannels: this.settings.get('lockedChannels', guildID),
                    ignoredUsers: this.settings.get('ignoredUsers', guildID),

                    filter: this.settings.get('filter', guildID)
                }

                const filterFunction = (settings.filter || this.options.filter).toString()

                const filter = filterFunction.includes('{') ?
                    filterFunction.split('{').slice(1).join('').slice(0, -1) :
                    'return ' + filterFunction.split('=>').slice(1).join('')

                const options: SettingsTypes = {
                    xp: settings.xp || this.options.xp,
                    maxXP: settings.maxXP || this.options.maxXP,
                    multiplier: settings.multiplier || this.options.multiplier,

                    status: settings.status == null ? this.options.status : settings.status,
                    ignoreBots: settings.ignoreBots == null ? this.options.ignoreBots : settings.ignoreBots,

                    lockedChannels: settings.lockedChannels || this.options.lockedChannels,
                    ignoredUsers: settings.ignoredUsers || this.options.ignoredUsers,

                    filter: new Function('msg', filter)
                }

                const lockedChannelsArray: string[] = []
                const ignoredUsersArray: string[] = []
                const ignoredGuildsArray: string[] = []

                const lockedChannels = options.lockedChannels
                const ignoredUsers = options.ignoredUsers
                const ignoredGuilds = this.options.ignoredGuilds

                for (let i of lockedChannels) {
                    const type = this.utils.typeOf(i)

                    switch (type) {
                        case 'String':
                            lockedChannelsArray.push(i as string)
                            break

                        default:
                            lockedChannelsArray.push(i as any)
                    }
                }
                const invalidChannelTypes = lockedChannelsArray.filter(x => typeof x !== 'string')

                if (invalidChannelTypes.length) {
                    throw new LevelingError(
                        errors.lockedChannels.invalidTypes
                        + '\n[\n'
                        + lockedChannels
                            .map((x: any) => {
                                const type = this.utils.typeOf(x)
                                const isOk = type == 'String' ? '(ok)' : ''

                                return `  ${x} - ${type} ${isOk}`
                            })
                            .join('\n')
                        + '\n]'
                    )
                }
                const invalidChannels = lockedChannelsArray.filter(x => x.length !== 18)
                if (invalidChannels.length) return console.log(new LevelingError(errors.lockedChannels.invalidChannels(invalidChannels)))


                for (let i of ignoredUsers) {
                    const type = this.utils.typeOf(i)

                    switch (type) {
                        case 'String':
                            ignoredUsersArray.push(i as string)
                            break

                        default:
                            ignoredUsersArray.push(i as any)
                    }
                }
                const invalidUserTypes = ignoredUsersArray.filter(x => typeof x !== 'string')

                if (invalidUserTypes.length) {
                    throw new LevelingError(
                        errors.ignoredUsers.invalidTypes
                        + '\n[\n'
                        + ignoredUsers
                            .map((x: any) => {
                                const type = this.utils.typeOf(x)
                                const isOk = type == 'String' ? '(ok)' : ''

                                return `  ${x} - ${type} ${isOk}`
                            })
                            .join('\n')
                        + '\n]'
                    )
                }
                const invalidUsers = ignoredUsersArray.filter(x => x.length !== 18)
                if (invalidUsers.length && ignoredUsers.length) return console.log(new LevelingError(errors.ignoredUsers.invalidUsers(ignoredUsers)))

                for (let i of ignoredGuilds) {
                    const type = this.utils.typeOf(i)

                    switch (type) {
                        case 'String':
                            ignoredGuildsArray.push(i as string)
                            break

                        default:
                            ignoredGuildsArray.push(i as any)
                    }
                }
                const invalidGuildTypes = ignoredGuildsArray.filter(x => typeof x !== 'string')

                if (invalidGuildTypes.length) {
                    throw new LevelingError(
                        errors.ignoredGuilds.invalidTypes
                        + '\n[\n'
                        + ignoredGuilds
                            .map((x: any) => {
                                const type = this.utils.typeOf(x)
                                const isOk = type == 'String' ? '(ok)' : ''

                                return `  ${x} - ${type} ${isOk}`
                            })
                            .join('\n')
                        + '\n]'
                    )
                }
                const invalidGuilds = ignoredGuildsArray.filter(x => x.length !== 18)
                if (invalidGuilds.length && ignoredGuilds.length) throw new LevelingError(errors.ignoredGuilds.invalidGuilds(invalidGuilds))

                const levelingStatus = options.status
                const isFiltered = (options.filter as Function)(message)

                const isUserIgnored = ignoredUsersArray.includes(message.author.id)
                const isLockedChannel = lockedChannelsArray.includes(message.channel.id)
                const isGuildIgnored = ignoredGuildsArray.includes(message.guild.id)

                const isBot = options.ignoreBots && message.author.bot

                const guildData = data[guildID]
                let memberData: RankObject = guildData?.[memberID]

                if (
                    levelingStatus && isFiltered &&
                    !isLockedChannel && !isUserIgnored &&
                    !isBot && !isGuildIgnored
                ) {

                    if (!memberData) {
                        this.utils.reset(memberID, guildID)
                        memberData = DefaultObject
                        return
                    }

                    const level = this.database.fetch(`${guildID}.${memberID}.level`)

                    const memberMultiplier = this.database.fetch(`${guildID}.${memberID}.multiplier`)

                    const userXP = this.database.fetch(`${guildID}.${memberID}.xp`)
                    const userMaxXP = this.database.fetch(`${guildID}.${memberID}.maxXP`)

                    const settingsXP = this.settings.get('xp', guildID)

                    const xp = options.xp
                    const multiplier = memberMultiplier == 1 ? options.multiplier : memberMultiplier

                    const memberXP = xp * multiplier
                    const newLevel = level + 1

                    this.xp.add(memberXP, memberID, guildID, true)
                    this.totalXP.add(memberXP, memberID, guildID, true)

                    this.database.set(`${guildID}.${memberID}.difference`, (userMaxXP - userXP) - settingsXP)

                    if (memberData.xp >= memberData.maxXP || memberXP > memberData.maxXP) {
                        const newMaxXP = options.maxXP * newLevel

                        this.xp.set(0, memberID, guildID, true)
                        this.levels.add(1, memberID, guildID, true)

                        this.database.set(`${guildID}.${memberID}.maxXP`, newMaxXP)
                        this.database.set(`${guildID}.${memberID}.difference`, newMaxXP)

                        this.emit('levelUp', {
                            guildID,
                            user: message.author,

                            level: newLevel,
                            maxXP: newMaxXP,
                            multiplier,

                            sendMessage: (msg: string | MessageEmbed | MessageAttachment | MessageOptions, channel?: string | Channel | TextChannel) => {
                                const type = this.utils.typeOf(msg)

                                let messageOptions: string | MessagePayload | MessageOptions
                                let textChannel: TextChannel

                                switch (type) {
                                    case 'String':
                                        messageOptions = {
                                            content: msg as string
                                        }
                                        break

                                    case 'Object':
                                        messageOptions = msg as MessageOptions
                                        break

                                    case 'MessageEmbed':
                                        messageOptions = {
                                            embeds: [
                                                msg as MessageEmbed
                                            ]
                                        }
                                        break

                                    case 'MessageAttachment':
                                        messageOptions = {
                                            files: [
                                                messageOptions as MessageAttachment
                                            ]
                                        }
                                        break

                                    default:
                                        throw new LevelingError(errors.sendMessage.invalidTypes.msg + type)
                                }

                                if (channel) {
                                    const channelType = this.utils.typeOf(channel)

                                    switch (channelType) {
                                        case 'String':
                                            textChannel = this.client.channels.cache.get(channel as string) as TextChannel
                                            break

                                        case 'Channel':
                                            textChannel = channel as TextChannel
                                            break

                                        case 'TextChannel':
                                            textChannel = channel as TextChannel
                                            break

                                        default:
                                            throw new LevelingError(errors.sendMessage.invalidTypes.channel + channelType)
                                    }

                                    if (!textChannel) throw new LevelingError(errors.sendMessage.channelNotFound)

                                    textChannel.send(messageOptions)
                                }

                                return message.channel.send(messageOptions)
                            }
                        })
                    }
                }
            }
        })
        return true
    }
}

export = Leveling