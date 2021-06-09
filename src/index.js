const { Client, Message, User } = require('discord.js')
const { readFileSync, writeFileSync, existsSync } = require('fs')
const LevelingError = require('./LevelingError')
const { EventEmitter } = require('events')
module.exports = class Leveling extends EventEmitter {
    /**
     * The Leveling class.
     * @param {Client} client Discord Bot Client.
     * @param {Object} options Constructor options object.
     * @param {String} options.storagePath Full path to a JSON file. Default: './leveling.json'.
     * @param {Boolean} options.checkStorage Checks the if database file exists and if it has errors. Default: true
     * @param {Number} options.xp Amount of XP that user will receive after sending a message. Default: 5.
     * @param {Boolean} options.status You can enable or disable the leveling system using this option. Default: true.
     * @param {Number} options.maxXP Amount of XP that user will totally need to reach the next level. This value will double for each level. Default: 300.
     * @param {Array<String>} options.lockedChannels Array of channel IDs that won't give XP to users. Default: [].
     * @param {fn} options.filter Callback function that must return a boolean value, it will add XP only to authors of filtered messages. Default: null.
     * @param {Number} options.updateCountdown Checks for if storage file exists in specified time (in ms). Default: 1000.
     * @param {Object} options.updater Update Checker options object.
     * @param {Boolean} options.updater.checkUpdates Sends the update state message in console on start. Default: true.
     * @param {Boolean} options.updater.upToDateMessage Sends the message in console on start if module is up to date. Default: true.
     * @param {Object} options.errorHandler Error Handler options object.
     * @param {Boolean} options.errorHandler.handleErrors Handles all errors on startup. Default: true.
     * @param {Number} options.errorHandler.attempts Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5.
     * @param {Number} options.errorHandler.time Time between every attempt to start the module (in ms). Default: 3000.
     */
    constructor(client, options) {
        /**
         * Callback function that accepts amessage, it must return a boolean value and it will add XP only to authors of filtered messages.; Use 'null' to disable the filter. Default: null.
         * @param {Message} msg
         * @returns {Boolean} Boolean value.
         */
        const fn = (msg) => { }
        super()
        /**
         * Module ready status.
         */
        this.ready = false
        /**
         * Leveling errored status.
         */
        this.errored = false
        /**
         * Module version.
         */
        this.version = module.exports.version || require('../package.json').version
        /**
         * Constructor options object.
         */
        this.options = options
        /**
         * Database checking interval.
         */
        this.interval = null
        /**
         * Leveling errors object.
         */
        this.errors = require('./errors')
        /**
         * Discord Bot Client.
         */
        this.client = client
        this.init()
    }
    /**
     * Checks for if the module is up to date.
     * @returns {Promise<{updated: Boolean, installedVersion: String, packageVersion: String>} This method will show is the module updated, latest version and installed version. [Promise: Object]
     */
    async checkUpdates() {
        const packageData = await require('node-fetch')(`https://registry.npmjs.com/discord-leveling-super`).then(text => text.json())
        if (this.version == packageData['dist-tags']?.latest) return {
            updated: true,
            installedVersion: this.version,
            packageVersion: packageData['dist-tags']?.latest || '1.0.0'
        }
        return {
            updated: false,
            installedVersion: this.version,
            packageVersion: packageData['dist-tags']?.latest || '1.0.0'
        }
    }
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    all() {
        return JSON.parse(readFileSync(this.options.storagePath).toString())
    }
    /**
     * Clears the storage file.
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    clearStorage() {
        if (readFileSync(this.options.storagePath).toString() == '{}') return false
        writeFileSync(this.options.storagePath, JSON.stringify({}), 'utf-8')
        return true
    }
    /**
     * Fetches the user's rank.
     * @param {String} guildID Guild ID
     * @param {String} memberID Member ID
     * @returns {data} User's rank.
     */
    rank(memberID, guildID) {
        const data = {
            /**
             * User's level.
             */
            level: Number(),
            /**
             * User's amount of XP.
             */
            xp: Number(),
            /**
             * User's total amount of XP.
             */
            totalXP: Number(),
            /**
             * How much XP in total the user need to reach the next level.
             */
            maxXP: Number(),
            /**
             * The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
             */
            difference: Number()
        }
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new LevelingError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        return obj[guildID][memberID] || {
            xp: null,
            totalXP: null,
            level: null,
            maxXP: null,
            difference: null
        }
    }
    /**
     * Shows a level leaderboard for your server
     * @param {String} guildID Guild ID
     * @returns {data} Sorted leaderboard array
     */
    leaderboard(guildID) {
        const data = [{ userID: String(), level: Number(), totalXP: Number(), xp: Number(), maxXP: Number(), difference: Number(), user: User }]
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        let serverData = this.all()[guildID]
        if (!serverData) return []
        let lb = []
        let users = Object.keys(serverData)
        let ranks = Object.values(serverData)//.map(x => x.totalXP)
        for (let i in users) lb.push({ userID: users[i], xp: ranks[i].xp, totalXP: ranks[i].totalXP, level: ranks[i].level, maxXP: ranks[i].maxXP, difference: ranks[i].difference, user: this.client.users.cache.get(users[i]) })
        return lb.sort((a, b) => b.totalXP - a.totalXP).filter(x => !isNaN(x.totalXP))
    }
    /**
     * Sets the level to specified user.
     * @param {Number | String} level New level.
     * @param {String} guildID Guild ID.
     * @param {String} memberID Member ID.
     * @returns {{
            xp: Number,
            totalXP: Number,
            level: Number,
            maxXP: Number,
            difference: Number
        }} Data object.
     */
    setLevel(level, memberID, guildID) {
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        if (typeof memberID !== 'string') throw new LevelingError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof level !== 'number' && typeof level !== 'string') throw new LevelingError(this.errors.invalidTypes.level + typeof level)
        const ranks = this.rank(memberID, guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) {
            obj[guildID] = {}
            obj[guildID][memberID] = {
                xp: 0,
                totalXP: 0,
                level: Number(level),
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
            this.emit('setLevel', {
                userID: memberID,
                guildID,
                xp: 0,
                totalXP: 0,
                level: Number(level),
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            })
            writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
            return {
                xp: 0,
                totalXP: 0,
                level: Number(level),
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
        }
        obj[guildID][memberID] = {
            xp: ranks.xp,
            totalXP: ranks.totalXP,
            level: Number(level),
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        }
        this.emit('setLevel', {
            userID: memberID,
            guildID,
            xp: ranks.xp,
            totalXP: ranks.totalXP,
            level: Number(level),
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        })
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return {
            xp: ranks.xp,
            totalXP: ranks.totalXP,
            level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        }
    }
    /**
     * Adds the level to specified user.
     * @param {Number | String} xp Amount of levels to add.
     * @param {String} guildID Guild ID.
     * @param {String} memberID Member ID.
     * @returns {{
        xp: Number,
        totalXP: Number,
        level: Number,
        maxXP: Number,
        difference: Number
    }} Data object.
    */
    addLevel(level, memberID, guildID) {
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        if (typeof memberID !== 'string') throw new LevelingError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof level !== 'number' && typeof level !== 'string') throw new LevelingError(this.errors.invalidTypes.level + typeof level)
        const ranks = this.rank(memberID, guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) {
            obj[guildID] = {}
            obj[guildID][memberID] = {
                xp: 0,
                totalXP: 0,
                level: Number(level),
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
            this.emit('addLevel', {
                userID: memberID,
                guildID,
                xp: 0,
                totalXP: 0,
                level: Number(level),
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            })
            writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
            return {
                xp: 0,
                totalXP: 0,
                level: Number(level),
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
        }
        obj[guildID][memberID] = {
            xp: ranks.xp,
            totalXP: ranks.totalXP,
            level: Number(level) + ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        }
        this.emit('addLevel', {
            userID: memberID,
            guildID,
            xp: ranks.xp,
            totalXP: ranks.totalXP,
            level: Number(level),
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        })
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return {
            xp: ranks.xp,
            totalXP: ranks.totalXP,
            level: Number(level) + ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        }
    }
    /**
     * Sets the XP to specified user.
     * @param {Number | String} xp Amount of XP to set.
     * @param {String} guildID Guild ID.
     * @param {String} memberID Member ID.
     * @returns {{
        xp: Number,
        totalXP: Number,
        level: Number,
        maxXP: Number,
        difference: Number
    }} Data object.
    */
    setXP(xp, memberID, guildID) {
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        if (typeof memberID !== 'string') throw new LevelingError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof xp !== 'number' && typeof xp !== 'string') throw new LevelingError(this.errors.invalidTypes.xp + typeof xp)
        const ranks = this.rank(memberID, guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) {
            obj[guildID] = {}
            obj[guildID][memberID] = {
                xp: Number(xp),
                totalXP: 0,
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
            this.emit('setXP', {
                userID: memberID,
                guildID,
                xp: Number(xp),
                totalXP: 0,
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            })
            writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
            return {
                xp: Number(xp),
                totalXP: 0,
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
        }
        obj[guildID][memberID] = {
            xp: Number(xp),
            totalXP: ranks.totalXP,
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - Number(xp)
        }
        this.emit('setXP', {
            userID: memberID,
            guildID,
            xp: Number(xp),
            totalXP: ranks.totalXP,
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - Number(xp)
        })
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return {
            xp: Number(xp),
            totalXP: ranks.totalXP,
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - Number(xp)
        }
    }
    /**
     * Adds the XP to specified user.
     * @param {Number | String} xp  Amount of XP to add.
     * @param {String} guildID Guild ID.
     * @param {String} memberID Member ID.
     * @returns {{
        xp: Number,
        totalXP: Number,
        level: Number,
        maxXP: Number,
        difference: Number
    }} Data object.
    */
    addXP(xp, memberID, guildID) {
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        if (typeof memberID !== 'string') throw new LevelingError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof xp !== 'number' && typeof xp !== 'string') throw new LevelingError(this.errors.invalidTypes.xp + typeof xp)
        const ranks = this.rank(memberID, guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) {
            obj[guildID] = {}
            obj[guildID][memberID] = {
                xp: Number(xp),
                totalXP: 0,
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
            this.emit('addXP', {
                userID: memberID,
                guildID,
                xp: Number(xp),
                totalXP: 0,
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            })
            writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
            return {
                xp: Number(xp),
                totalXP: 0,
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
        }
        obj[guildID][memberID] = {
            xp: ranks.xp + Number(xp),
            totalXP: ranks.totalXP,
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - xp
        }
        this.emit('addXP', {
            userID: memberID,
            guildID,
            xp: Number(xp),
            totalXP: ranks.totalXP,
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - xp
        })
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return {
            xp: ranks.xp + Number(xp),
            totalXP: ranks.totalXP,
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - xp
        }
    }
    /**
     * Sets the total XP to specified user.
     * @param {Number | String} xp Amount of XP to set.
     * @param {String} guildID Guild ID.
     * @param {String} memberID Member ID.
     * @returns {{
        xp: Number,
        totalXP: Number,
        level: Number,
        maxXP: Number,
        difference: Number
    }} Data object.
    */
    setTotalXP(xp, memberID, guildID) {
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        if (typeof memberID !== 'string') throw new LevelingError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof xp !== 'number' && typeof xp !== 'string') throw new LevelingError(this.errors.invalidTypes.xp + typeof xp)
        const ranks = this.rank(memberID, guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) {
            obj[guildID] = {}
            obj[guildID][memberID] = {
                xp: 0,
                totalXP: Number(xp),
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
            this.emit('setTotalXP', {
                userID: memberID,
                guildID,
                xp: 0,
                totalXP: Number(xp),
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            })
            writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
            return {
                xp: 0,
                totalXP: Number(xp),
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
        }
        obj[guildID][memberID] = {
            xp: ranks.xp,
            totalXP: Number(xp),
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        }
        this.emit('setTotalXP', {
            userID: memberID,
            guildID,
            xp: ranks.xp,
            totalXP: Number(xp),
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        })
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return {
            xp: ranks.xp,
            totalXP: Number(xp),
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        }
    }
    /**
     * Adds the total XP to specified user.
     * @param {Number | String} xp Amount of XP to add.
     * @param {String} guildID Guild ID.
     * @param {String} memberID Member ID.
     * @returns {{
        xp: Number,
        totalXP: Number,
        level: Number,
        maxXP: Number,
        difference: Number
    }} Data object.
    */
    addTotalXP(xp, memberID, guildID) {
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        if (typeof memberID !== 'string') throw new LevelingError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof xp !== 'number' && typeof xp !== 'string') throw new LevelingError(this.errors.invalidTypes.xp + typeof xp)
        const ranks = this.rank(memberID, guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) {
            obj[guildID] = {}
            obj[guildID][memberID] = {
                xp: 0,
                totalXP: Number(xp),
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
            this.emit('addTotalXP', {
                userID: memberID,
                guildID,
                xp: 0,
                totalXP: Number(xp),
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            })
            writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
            return {
                xp: 0,
                totalXP: Number(xp),
                level: 1,
                maxXP: this.options.maxXP,
                difference: this.options.maxXP
            }
        }
        obj[guildID][memberID] = {
            xp: ranks.xp,
            totalXP: ranks.totalXP + Number(xp),
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        }
        this.emit('addTotalXP', {
            userID: memberID,
            guildID,
            xp: ranks.xp,
            totalXP: Number(xp),
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        })
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return {
            xp: ranks.xp,
            totalXP: ranks.totalXP + Number(xp),
            level: ranks.level,
            maxXP: ranks.maxXP,
            difference: ranks.maxXP - ranks.xp
        }
    }
    /**
     * Fully removes the guild from database.
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    removeGuild(guildID) {
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) return false
        obj[guildID] = {}
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        const content = readFileSync(this.options.storagePath).toString()
        writeFileSync(this.options.storagePath, JSON.stringify(JSON.parse(content.replace(`"${guildID}":{},`, ''))))
        return true
    }
    /**
     * Removes the user from database.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    removeUser(memberID, guildID) {
        if (!this.ready) throw new LevelingError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new LevelingError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new LevelingError(this.errors.invalidTypes.guildID + typeof guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]?.[memberID] || !Object.keys(obj[guildID]?.[memberID]).length) return false
        obj[guildID][memberID] = {}
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
    /**
    * Kills the Leveling instance.
    * @returns {this} Leveling instance.
    */
    kill() {
        clearInterval(this.interval)
        this.interval = null
        this.options = {}
        this.ready = false
        return this
    }
    /**
     * Starts the module.
     * @returns {Promise<true | Error>} If started successfully: true; else: Error instance.
     */
    init() {
        this.LevelingError = LevelingError
        if (!this.options) this.options = {}
        typeof this.options.errorHandler == 'object' ? this.options.errorHandler : this.options.errorHandler = {}
        this.options.errorHandler.handleErrors == undefined ? this.options.errorHandler.handleErrors = true : this.options.errorHandler?.handleErrors
        this.options.errorHandler.attempts !== undefined ? this.options.errorHandler.attempts == null ? this.options.errorHandler.attempts = Infinity : this.options.errorHandler?.attempts : this.options.errorHandler.attempts = 5
        this.options.errorHandler.time == undefined ? this.options.errorHandler.time = 5000 : this.options.errorHandler?.time
        return this.options.errorHandler?.handleErrors ? this._init().catch(async err => {
            let attempt = 0
            if (!err instanceof LevelingError) this.errored = true
            console.log('\x1b[31mFailed to start the module:\x1b[36m')
            console.log(err)
            if (err instanceof ReferenceError) {
                this.errored = true
                return console.log('\x1b[33mTip: Reference Errors are very important and serious errors and they cannot be handled.')
            }
            else console.log(`\x1b[35mRetrying in ${(this.options.errorHandler.time / 1000).toFixed(1)} seconds...`)
            const check = () => new Promise(resolve => {
                this._init().then(x => {
                    if (x) {
                        this.errored = false
                        console.log('\x1b[32mStarted successfully! :)')
                    }
                    resolve(x)
                }).catch(err => resolve(err))
            })
            const sleep = require('util').promisify(setTimeout);
            let attempts = this.options.errorHandler.attempts == null ? Infinity : this.options.errorHandler.attempts
            while (attempt < attempts && attempt !== -1) {
                await sleep(this.options.errorHandler.time)
                if (attempt < attempts) check().then(async res => {
                    if (res.message) {
                        attempt++
                        console.log('\x1b[31mFailed to start the module:\x1b[36m')
                        console.log(err)
                        console.log(`\x1b[34mAttempt ${attempt}${attempts == Infinity ? '.' : `/${this.options.errorHandler.attempts}`}`)
                        if (attempt == attempts) return console.log(`\x1b[32mFailed to start the module within ${this.options.errorHandler.attempts} attempts...`)
                        console.log(`\x1b[35mRetrying in ${(this.options.errorHandler.time / 1000).toFixed(1)} seconds...`)
                        await sleep(this.options.errorHandler.time)
                        delete require.cache[require.resolve(`./index.js`)]
                        check()
                    } else {
                        attempt = -1
                    }
                })
            }
        }) : this._init()
    }
    /**
     * Initializates the module.
     * @returns {Promise<true | Error>} If started successfully: true; else: Error instance.
     * @private
     */
    _init() {
        return new Promise(async (resolve, reject) => {
            try {
                if (Number(process.version.split('.')[0].slice(1)) < 14) return reject(new LevelingError(this.errors.oldNodeVersion + process.version))
                if (!this.client) throw new LevelingError(this.errors.noClient)
                if (this.errored) return
                if (this.ready) return
                this.options.storagePath = this.options.storagePath || './leveling.json'
                if (!this.options.storagePath.endsWith('json') && !this.options.storagePath.endsWith('json/')) return reject(new LevelingError(this.errors.invalidStorage))
                typeof this.options.errorHandler == 'object' ? this.options.errorHandler : this.options.errorHandler = {}
                this.options.errorHandler.handleErrors == undefined ? this.options.errorHandler.handleErrors = true : this.options.errorHandler?.handleErrors
                this.options.errorHandler.attempts == undefined ? this.options.errorHandler.attempts = 3 : this.options.errorHandler?.attempts
                this.options.errorHandler.time == undefined ? this.options.errorHandler.time = 5000 : this.options.errorHandler?.time
                if (this.options.checkStorage == undefined ? true : this.options.checkStorage) {
                    if (!existsSync(this.options.storagePath)) writeFileSync(this.options.storagePath, '{}')
                    try {
                        JSON.parse(readFileSync(this.options.storagePath).toString())
                    } catch (err) {
                        if (err.message.includes('Unexpected') && err.message.includes('JSON')) return reject(new LevelingError(this.errors.wrongStorageData))
                        else return reject(err)
                    }
                }
                this.options.dailyAmount == undefined || this.options.dailyAmount == null ? this.options.dailyAmount = 100 : this.options.dailyAmount = this.options.dailyAmount
                this.options.updateCountdown == undefined || this.options.updateCountdown == null ? this.options.updateCountdown = 1000 : this.options.updateCountdown = this.options.updateCountdown
                this.options.status == undefined ? this.options.status = true : this.options.status
                this.options.lockedChannels == undefined ? this.options.lockedChannels = [] : this.options.lockedChannels
                this.options.filter == undefined ? this.options.filter = () => true : this.options.filter
                this.options.xp == undefined || this.options.xp == null ? this.options.xp = 5 : this.options.xp = this.options.xp
                this.options.maxXP == undefined || this.options.maxXP == null ? this.options.maxXP = 300 : this.options.maxXP = this.options.maxXP
                this.options.checkStorage == undefined ? this.options.checkStorage = true : this.options.checkStorage
                typeof this.options.updater == 'object' ? this.options.updater : this.options.updater = {}
                typeof this.options.errorHandler == 'object' ? this.options.errorHandler : this.options.errorHandler = {}
                this.options.errorHandler.handleErrors == undefined ? this.options.errorHandler.handleErrors = true : this.options.errorHandler?.handleErrors
                this.options.errorHandler.attempts == undefined ? this.options.errorHandler.attempts = 5 : this.options.errorHandler?.attempts
                this.options.errorHandler.time == undefined ? this.options.errorHandler.time = 3000 : this.options.errorHandler?.time
                this.options.updater.checkUpdates == undefined ? this.options.updater.checkUpdates = true : this.options.updater?.checkUpdates
                this.options.updater.upToDateMessage == undefined ? this.options.updater.upToDateMessage = true : this.options.updater?.upToDateMessage
                if (this.options.updater?.checkUpdates) {
                    const version = await this.checkUpdates()
                    const colors = {
                        red: '\x1b[31m',
                        green: '\x1b[32m',
                        yellow: '\x1b[33m',
                        blue: '\x1b[34m',
                        magenta: '\x1b[35m',
                        cyan: '\x1b[36m',
                        white: '\x1b[37m',
                    }
                    if (!version.updated) {
                        console.log('\n\n')
                        console.log(colors.green + '----------------------------------------------------')
                        console.log(colors.green + '| @ discord-leveling-super                  - [] X |')
                        console.log(colors.green + '----------------------------------------------------')
                        console.log(colors.yellow + `|             The module is ${colors.red}out of date!${colors.yellow}           |`)
                        console.log(colors.magenta + '|               New version is avaible!            |')
                        console.log(colors.blue + `|                   ${version.installedVersion} --> ${version.packageVersion}                |`)
                        console.log(colors.cyan + '|     Run "npm i discord-leveling-super@latest"    |')
                        console.log(colors.cyan + '|                     to update!                   |')
                        console.log(colors.white + `|           View the full changelog here:          |`)
                        console.log(colors.red + '| https://npmjs.com/package/discord-leveling-super |')
                        console.log(colors.green + '----------------------------------------------------\x1b[37m')
                        console.log('\n\n')
                    } else {
                        if (this.options.updater?.upToDateMessage) {
                            console.log('\n\n')
                            console.log(colors.green + '----------------------------------------------------')
                            console.log(colors.green + '| @ discord-leveling-super                  - [] X |')
                            console.log(colors.green + '----------------------------------------------------')
                            console.log(colors.yellow + `|            The module is ${colors.cyan}up to date!${colors.yellow}             |`)
                            console.log(colors.magenta + '|             No updates are avaible.              |')
                            console.log(colors.blue + `|            Currnet version is ${version.packageVersion}.             |`)
                            console.log(colors.cyan + '|                     Enjoy!                       |')
                            console.log(colors.white + `|          View the full changelog here:           |`)
                            console.log(colors.red + '| https://npmjs.com/package/discord-leveling-super |')
                            console.log(colors.green + '----------------------------------------------------\x1b[37m')
                            console.log('\n\n')
                        }
                    }
                }
                if (typeof this.options !== 'object') throw new LevelingError(this.errors.invalidTypes.constructorOptions.options + typeof this.options)
                if (typeof this.options.updater !== 'object') throw new LevelingError(this.errors.invalidTypes.constructorOptions.updaterType + typeof this.options.updater)
                if (typeof this.options.errorHandler !== 'object') throw new LevelingError(this.errors.invalidTypes.constructorOptions.errorHandlerType + typeof this.options.errorHandler)
                if (typeof this.options.storagePath !== 'string') throw new LevelingError(this.errors.invalidTypes.constructorOptions.storagePath + typeof this.options.storagePath)
                if (this.options.status && typeof this.options.status !== 'boolean') throw new LevelingError(this.errors.invalidTypes.constructorOptions.status + typeof this.options.status)
                if (this.options.xp && typeof this.options.xp !== 'number' && this.options.xp !== 'string') throw new LevelingError(this.errors.invalidTypes.constructorOptions.xp + typeof this.options.xp)
                if (this.options.maxXP && typeof this.options.maxXP !== 'number' && this.options.maxXP !== 'string') throw new LevelingError(this.errors.invalidTypes.constructorOptions.maxXP + typeof this.options.maxXP)
                if (this.options.filter && typeof this.options.filter !== 'function') throw new LevelingError(this.errors.invalidTypes.constructorOptions.filter + typeof this.options.filter)
                if (this.options.lockedChannels && !Array.isArray(this.options.lockedChannels)) throw new LevelingError(this.errors.invalidTypes.constructorOptions.lockedChannels + typeof this.options.lockedChannels)
                if (this.options.errorHandler.attempts && typeof this.options.errorHandler.attempts !== 'number') throw new LevelingError(this.errors.invalidTypes.constructorOptions.errorHandler.attempts + typeof this.options.errorHandler.attempts)
                if (this.options.errorHandler.time && typeof this.options.errorHandler.time !== 'number') throw new LevelingError(this.errors.invalidTypes.constructorOptions.errorHandler.time + typeof this.options.errorHandler.time)
                if (this.options.errorHandler.handleErrors && typeof this.options.errorHandler.handleErrors !== 'boolean') throw new LevelingError(this.errors.invalidTypes.constructorOptions.errorHandler.handleErrors + typeof this.options.errorHandler.handleErrors)
                if (this.options.updater.checkUpdates && typeof this.options.updater.checkUpdates !== 'boolean') throw new LevelingError(this.errors.invalidTypes.constructorOptions.updater.checkUpdates + typeof this.options.updater.checkUpdates)
                if (this.options.updater.upToDateMessage && typeof this.options.updater.upToDateMessage !== 'boolean') throw new LevelingError(this.errors.invalidTypes.constructorOptions.updater.upToDateMessage + typeof this.options.updater.upToDateMessage)
                this.options.xp = Number(this.options.xp)
                this.options.maxXP = Number(this.options.maxXP)
                if (this.options.checkStorage == undefined ? true : this.options.checkStorage) {
                    const interval = setInterval(() => {
                        const storageExists = existsSync(this.options.storagePath)
                        if (!storageExists) {
                            try {
                                writeFileSync(this.options.storagePath, '{}', 'utf-8')
                            } catch (err) {
                                throw new LevelingError(this.errors.notReady)
                            }
                            console.log('\x1b[36mfailed to find a database file; created another one...\x1b[37m')
                        }
                        try {
                            JSON.parse(readFileSync(this.options.storagePath).toString())
                        } catch (err) {
                            if (err.message.includes('Unexpected token') || err.message.includes('Unexpected end')) {
                                throw new LevelingError(this.errors.wrongStorageData)
                            }
                            else {
                                reject(err)
                                throw err
                            }
                        }
                    }, this.options.updateCountdown)
                    this.interval = interval
                }
                this.ready = true
                module.exports.ready = true
                return resolve(true)
            } catch (err) {
                this.errored = true
                reject(err)
            }
        }).then(() => {
            this.client.on('message', async message => {
                if (!this.options.lockedChannels.includes(message.channel.id)) {
                    const guildID = message.guild.id
                    const memberID = message.author.id
                    const xpAmount = this.options.xp
                    const { xp, totalXP, level, maxXP } = this.rank(memberID, guildID)
                    const messageXP = Array.isArray(xpAmount) ? Math.ceil(Math.random() * (Number(xpAmount[0]) - Number(xpAmount[1])) + Number(xpAmount[1])) : this.options.xp
                    const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
                    if (!obj[guildID]) obj[guildID] = {}
                    if (message.author.bot) return
                    if (this.options.status == true) {
                        if (!obj[guildID][memberID]) {
                            obj[guildID][memberID] = {
                                xp: 0,
                                totalXP: 0,
                                level: 1,
                                maxXP: this.options.maxXP,
                                difference: this.options.maxXP
                            }
                            return writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
                        }
                        if (xp >= maxXP - 1) {
                            this.emit('levelUp', {
                                guildID,
                                user: message.author,
                                level: level + 1,
                                maxXP: this.options.maxXP * (level + 1),
                                sendMessage: (msg, channel) => {
                                    if (channel) return this.client.channels.cache.get(channel).send(msg)
                                    return message.channel.send(msg)
                                }
                            })
                            obj[guildID][memberID] = {
                                xp: 0,
                                totalXP,
                                level: level + 1,
                                maxXP: this.options.maxXP * (level + 1),
                                difference: this.options.maxXP * (level + 1),
                            }
                            return writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
                        }
                        if (!this.options.lockedChannels.includes(message.channel.id) && this.options.filter(message)) {
                            obj[guildID][memberID] = {
                                xp: xp + messageXP,
                                totalXP: totalXP + messageXP,
                                level,
                                maxXP,
                                difference: maxXP - (xp + messageXP)
                            }
                            this.emit('addXP', {
                                guildID: message.guild.id,
                                userID: message.author.id,
                                xp: messageXP,
                                totalXP: totalXP + messageXP,
                                level,
                                maxXP,
                                difference: maxXP - (xp + messageXP)
                            })
                            writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
                        }
                    }
                }
            })
        })
    }
}