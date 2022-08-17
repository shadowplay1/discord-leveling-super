"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const util_1 = require("util");
const fs_1 = require("fs");
const Emitter_1 = __importDefault(require("./classes/Emitter"));
const LevelingError_1 = __importDefault(require("./classes/LevelingError"));
const Errors_1 = __importDefault(require("./structures/Errors"));
const DefaultObject_1 = __importDefault(require("./structures/DefaultObject"));
const UtilsManager_1 = __importDefault(require("./managers/UtilsManager"));
const DatabaseManager_1 = __importDefault(require("./managers/DatabaseManager"));
const FetchManager_1 = __importDefault(require("./managers/FetchManager"));
const RanksManager_1 = __importDefault(require("./managers/RanksManager"));
const XPManager_1 = __importDefault(require("./managers/XPManager"));
const LevelManager_1 = __importDefault(require("./managers/LevelManager"));
const TotalXPManager_1 = __importDefault(require("./managers/TotalXPManager"));
const SettingsManager_1 = __importDefault(require("./managers/SettingsManager"));
const package_json_1 = __importDefault(require("../package.json"));
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
};
/**
 * The Leveling class.
 * @extends {Emitter}
 */
class Leveling extends Emitter_1.default {
    /**
     * Leveling options object.
     * @type {LevelingOptions}
     */
    options;
    /**
     * Discord Bot Client
     * @type {Client}
     */
    client;
    /**
     * Module ready status.
     * @type {Boolean}
     */
    ready;
    /**
     * Module errored status.
     * @type {Boolean}
     */
    errored;
    /**
     * Database checking interval.
     * @type {NodeJS.Timeout}
     */
    interval;
    /**
    * Leveling error class.
    * @type {LevelingError}
    */
    LevelingError;
    /**
     * Utils manager methods object.
     * @type {UtilsManager}
     */
    utils;
    /**
     * Module version.
     * @type {String}
     */
    version;
    /**
     * Link to the module's documentation website.
     * @type {String}
     */
    docs;
    /**
    * Database manager methods object.
    * @type {DatabaseManager}
    */
    database;
    /**
    * XP manager methods object.
    * @type {FetchManager}
    */
    fetcher;
    /**
     * Settings manager methods class.
     * @type {SettingsManager}
     */
    settings;
    /**
    * XP manager methods object.
    * @type {XPManager}
    */
    xp;
    /**
    * Level manager methods object.
    * @type {LevelManager}
    */
    levels;
    /**
    * Total XP manager methods object.
    * @type {LevelManager}
    */
    totalXP;
    /**
    * Ranks manager methods object.
    * @type {RanksManager}
    */
    ranks;
    /**
     * The Leveling class.
     * @param {Client} client Discord Bot Client.
     * @param {LevelingOptions} options Leveling options object.
     */
    constructor(client, options = {}) {
        super();
        this.LevelingError = LevelingError_1.default;
        this.utils = new UtilsManager_1.default(options, client);
        this.options = this.utils.checkOptions(options.optionsChecker, options || {});
        this.client = client;
        this.ready = false;
        this.errored = false;
        this.interval = null;
        this.version = package_json_1.default.version;
        this.docs = 'https://dls-docs.js.org';
        this.database = null;
        this.fetcher = null;
        this.settings = null;
        this.xp = null;
        this.levels = null;
        this.totalXP = null;
        this.ranks = null;
        this.init();
    }
    /**
    * Kills the Leveling instance.
    * @fires Leveling#destroy
    * @returns {Leveling | boolean} Leveling instance.
    */
    kill() {
        if (!this.ready)
            return false;
        clearInterval(this.interval);
        this.ready = false;
        this.LevelingError = null;
        this.interval = null;
        this.utils = null;
        this.database = null;
        this.fetcher = null;
        this.settings = null;
        this.xp = null;
        this.levels = null;
        this.totalXP = null;
        this.ranks = null;
        this.emit('destroy');
        return this;
    }
    /**
    * Starts the module.
    * @fires Leveling#ready
    * @returns {Promise<Boolean>} If started successfully: true; else: Error instance.
    */
    init() {
        let attempt = 0;
        let attempts = this.options?.errorHandler?.attempts == 0 ? Infinity : this.options?.errorHandler?.attempts;
        const time = this.options?.errorHandler?.time;
        const retryingTime = (time / 1000).toFixed(1);
        const sleep = (0, util_1.promisify)(setTimeout);
        const check = () => new Promise(resolve => {
            this._init().then(x => {
                if (x) {
                    this.errored = false;
                    this.ready = true;
                    return console.log(`${colors.green}Started successfully! :)`);
                }
                resolve(x);
            }).catch(err => resolve(err));
        });
        return this.options?.errorHandler?.handleErrors ? this._init().catch(async (err) => {
            if (!(err instanceof LevelingError_1.default))
                this.errored = true;
            console.log(`${colors.red}Failed to start the module:${colors.cyan}`);
            console.log(err);
            if (err.message.includes('This module is supporting only Node.js v14 or newer.'))
                process.exit(1);
            else
                console.log(`${colors.magenta}Retrying in ${retryingTime} seconds...${colors.reset}`);
            while (attempt < attempts && attempt !== -1) {
                await sleep(time);
                if (attempt < attempts)
                    check().then(async (res) => {
                        if (res.message) {
                            attempt++;
                            console.log(`${colors.red}Failed to start the module:${colors.cyan}`);
                            console.log(err);
                            console.log(`\x1b[34mAttempt ${attempt}${attempts == Infinity ? '.' : `/${attempts}`}`);
                            if (attempt == attempts) {
                                console.log(`${colors.green}Failed to start the module within ${attempts} attempts...${colors.reset}`);
                                process.exit(1);
                            }
                            console.log(`${colors.magenta}Retrying in ${retryingTime} seconds...`);
                            await sleep(time);
                        }
                        else
                            attempt = -1;
                    });
            }
        }) : this._init();
    }
    /**
     * Initializates the module.
     * @returns {Promise<boolean>} If started successfully: true; else: Error instance.
     * @private
     */
    _init() {
        const storagePath = this.options.storagePath || './leveling.json';
        const updateCountdown = this.options.updateCountdown;
        const isFileExist = (0, fs_1.existsSync)(storagePath);
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.client)
                    return reject(new LevelingError_1.default(Errors_1.default.noClient));
                if (this.errored)
                    return;
                if (this.ready)
                    return;
                if (this.options?.checkStorage) {
                    if (!isFileExist)
                        (0, fs_1.writeFileSync)(storagePath, '{}');
                    try {
                        if (storagePath.endsWith('package.json'))
                            return reject(new LevelingError_1.default(Errors_1.default.reservedName('package.json')));
                        if (storagePath.endsWith('package-lock.json'))
                            return reject(new LevelingError_1.default(Errors_1.default.reservedName('package-lock.json')));
                        const data = (0, fs_1.readFileSync)(storagePath);
                        JSON.parse(data.toString());
                    }
                    catch (err) {
                        if (err.message.includes('Unexpected') && err.message.includes('JSON'))
                            return reject(new LevelingError_1.default(Errors_1.default.wrongStorageData));
                        else
                            reject(err);
                    }
                }
                if (this.options.updater?.checkUpdates) {
                    const version = await this.utils.checkUpdates();
                    if (!version.updated) {
                        console.log('\n\n');
                        console.log(colors.green + '╔═══════════════════════════════════════════════════════════════╗');
                        console.log(colors.green + '║ @ discord-leveling-super                               - [] X ║');
                        console.log(colors.green + '║═══════════════════════════════════════════════════════════════║');
                        console.log(colors.yellow + `║                  The module is ${colors.red}out of date!${colors.yellow}                   ║`);
                        console.log(colors.magenta + '║                   New version is available!                   ║');
                        console.log(colors.blue + `║                        ${version.installedVersion} --> ${version.packageVersion}                        ║`);
                        console.log(colors.cyan + '║          Run "npm i discord-leveling-super@latest"            ║');
                        console.log(colors.cyan + '║                         to update!                            ║');
                        console.log(colors.white + '║                View the full changelog here:                  ║');
                        console.log(colors.red + '║  https://dls-docs.js.org/#/docs/main/stable/general/changelog ║');
                        console.log(colors.green + '╚═══════════════════════════════════════════════════════════════╝\x1b[37m');
                        console.log('\n\n');
                    }
                    else {
                        if (this.options?.updater?.upToDateMessage) {
                            console.log('\n\n');
                            console.log(colors.green + '╔═══════════════════════════════════════════════════════════════╗');
                            console.log(colors.green + '║ @ discord-leveling-super                               - [] X ║');
                            console.log(colors.green + '║═══════════════════════════════════════════════════════════════║');
                            console.log(colors.yellow + `║                   The module is ${colors.cyan}up of date!${colors.yellow}                   ║`);
                            console.log(colors.magenta + '║                   No updates are available.                   ║');
                            console.log(colors.blue + `║                   Current version is ${version.packageVersion}.                   ║`);
                            console.log(colors.cyan + '║                            Enjoy!                             ║');
                            console.log(colors.white + '║                View the full changelog here:                  ║');
                            console.log(colors.red + '║  https://dls-docs.js.org/#/docs/main/stable/general/changelog ║');
                            console.log(colors.green + '╚═══════════════════════════════════════════════════════════════╝\x1b[37m');
                            console.log('\n\n');
                        }
                    }
                }
                if (this.options?.checkStorage == undefined ? true : this.options?.checkStorage) {
                    const storageExists = (0, fs_1.existsSync)(storagePath);
                    const interval = setInterval(() => {
                        if (!storageExists) {
                            try {
                                if (storagePath?.endsWith('package.json'))
                                    throw new LevelingError_1.default(Errors_1.default.reservedName('package.json'));
                                if (storagePath?.endsWith('package-lock.json'))
                                    throw new LevelingError_1.default(Errors_1.default.reservedName('package-lock.json'));
                                (0, fs_1.writeFileSync)(storagePath, '{}', 'utf-8');
                            }
                            catch (err) {
                                throw new LevelingError_1.default(Errors_1.default.notReady);
                            }
                            console.log(`${colors.red}failed to find a database file; created another one...${colors.reset}`);
                        }
                        try {
                            if (!storageExists)
                                (0, fs_1.writeFileSync)(storagePath, '{}', 'utf-8');
                            const data = (0, fs_1.readFileSync)(storagePath);
                            JSON.parse(data.toString());
                        }
                        catch (err) {
                            if (err.message.includes('Unexpected token') ||
                                err.message.includes('Unexpected end'))
                                reject(new LevelingError_1.default(Errors_1.default.wrongStorageData));
                            else {
                                reject(err);
                                throw err;
                            }
                        }
                    }, updateCountdown);
                    this.interval = interval;
                }
                this.start();
                this.ready = true;
                this.emit('ready', undefined);
                return resolve(true);
            }
            catch (err) {
                this.errored = true;
                reject(err);
            }
        });
    }
    /**
     * Starts all the managers.
     * @returns {Boolean} If successfully started: true.
     * @private
     */
    start() {
        this.utils = new UtilsManager_1.default(this.options, this.client);
        this.database = new DatabaseManager_1.default(this.options);
        this.fetcher = new FetchManager_1.default(this.options);
        this.settings = new SettingsManager_1.default(this.options, this.client);
        this.xp = new XPManager_1.default(this.options);
        this.levels = new LevelManager_1.default(this.options);
        this.totalXP = new TotalXPManager_1.default(this.options);
        this.ranks = new RanksManager_1.default(this.options, this.client);
        if (!this.client.on) {
            console.log(new LevelingError_1.default(Errors_1.default.invalidClient));
            process.exit(1);
        }
        this.client.on('messageCreate', async (message) => {
            if (this.ready) {
                const data = this.fetcher.fetchAll();
                const guildID = message.guild.id;
                const memberID = message.author.id;
                const settings = {
                    xp: this.settings.get('xp', guildID),
                    maxXP: this.settings.get('maxXP', guildID),
                    multiplier: this.settings.get('multiplier', guildID),
                    status: this.settings.get('status', guildID),
                    ignoreBots: this.settings.get('ignoreBots', guildID),
                    lockedChannels: this.settings.get('lockedChannels', guildID),
                    ignoredUsers: this.settings.get('ignoredUsers', guildID),
                    filter: this.settings.get('filter', guildID)
                };
                const filterFunction = (settings.filter || this.options.filter).toString();
                const filter = filterFunction.includes('{') ?
                    filterFunction.split('{').slice(1).join('').slice(0, -1) :
                    'return ' + filterFunction.split('=>').slice(1).join('');
                const options = {
                    xp: settings.xp || this.options.xp,
                    maxXP: settings.maxXP || this.options.maxXP,
                    multiplier: settings.multiplier || this.options.multiplier,
                    status: settings.status == null ? this.options.status : settings.status,
                    ignoreBots: settings.ignoreBots == null ? this.options.ignoreBots : settings.ignoreBots,
                    lockedChannels: settings.lockedChannels || this.options.lockedChannels,
                    ignoredUsers: settings.ignoredUsers || this.options.ignoredUsers,
                    filter: new Function('msg', filter)
                };
                const lockedChannelsArray = [];
                const ignoredUsersArray = [];
                const ignoredGuildsArray = [];
                const lockedChannels = options.lockedChannels;
                const ignoredUsers = options.ignoredUsers;
                const ignoredGuilds = this.options.ignoredGuilds;
                for (let i of lockedChannels) {
                    const type = this.utils.typeOf(i);
                    switch (type) {
                        case 'String':
                            lockedChannelsArray.push(i);
                            break;
                        default:
                            lockedChannelsArray.push(i);
                    }
                }
                const invalidChannelTypes = lockedChannelsArray.filter(x => typeof x !== 'string');
                if (invalidChannelTypes.length) {
                    throw new LevelingError_1.default(Errors_1.default.lockedChannels.invalidTypes
                        + '\n[\n'
                        + lockedChannels
                            .map((x) => {
                            const type = this.utils.typeOf(x);
                            const isOk = type == 'String' ? '(ok)' : '';
                            return `  ${x} - ${type} ${isOk}`;
                        })
                            .join('\n')
                        + '\n]');
                }
                const invalidChannels = lockedChannelsArray.filter(x => x.length !== 18 && x.length !== 19);
                if (invalidChannels.length)
                    return console.log(new LevelingError_1.default(Errors_1.default.lockedChannels.invalidChannels(invalidChannels)));
                for (let i of ignoredUsers) {
                    const type = this.utils.typeOf(i);
                    switch (type) {
                        case 'String':
                            ignoredUsersArray.push(i);
                            break;
                        default:
                            ignoredUsersArray.push(i);
                    }
                }
                const invalidUserTypes = ignoredUsersArray.filter(x => typeof x !== 'string');
                if (invalidUserTypes.length) {
                    throw new LevelingError_1.default(Errors_1.default.ignoredUsers.invalidTypes
                        + '\n[\n'
                        + ignoredUsers
                            .map((x) => {
                            const type = this.utils.typeOf(x);
                            const isOk = type == 'String' ? '(ok)' : '';
                            return `  ${x} - ${type} ${isOk}`;
                        })
                            .join('\n')
                        + '\n]');
                }
                const invalidUsers = ignoredUsersArray.filter(x => x.length !== 18 && x.length !== 19);
                if (invalidUsers.length && ignoredUsers.length)
                    return console.log(new LevelingError_1.default(Errors_1.default.ignoredUsers.invalidUsers(ignoredUsers)));
                for (let i of ignoredGuilds) {
                    const type = this.utils.typeOf(i);
                    switch (type) {
                        case 'String':
                            ignoredGuildsArray.push(i);
                            break;
                        default:
                            ignoredGuildsArray.push(i);
                    }
                }
                const invalidGuildTypes = ignoredGuildsArray.filter(x => typeof x !== 'string');
                if (invalidGuildTypes.length) {
                    throw new LevelingError_1.default(Errors_1.default.ignoredGuilds.invalidTypes
                        + '\n[\n'
                        + ignoredGuilds
                            .map((x) => {
                            const type = this.utils.typeOf(x);
                            const isOk = type == 'String' ? '(ok)' : '';
                            return `  ${x} - ${type} ${isOk}`;
                        })
                            .join('\n')
                        + '\n]');
                }
                const invalidGuilds = ignoredGuildsArray.filter(x => x.length !== 18 && x.length !== 19);
                if (invalidGuilds.length && ignoredGuilds.length)
                    throw new LevelingError_1.default(Errors_1.default.ignoredGuilds.invalidGuilds(invalidGuilds));
                const levelingStatus = options.status;
                const isFiltered = options.filter(message);
                const isUserIgnored = ignoredUsersArray.includes(message.author.id);
                const isLockedChannel = lockedChannelsArray.includes(message.channel.id);
                const isGuildIgnored = ignoredGuildsArray.includes(message.guild.id);
                const isBot = options.ignoreBots && message.author.bot;
                const guildData = data[guildID];
                let memberData = guildData?.[memberID];
                if (levelingStatus && isFiltered &&
                    !isLockedChannel && !isUserIgnored &&
                    !isBot && !isGuildIgnored) {
                    if (!memberData) {
                        this.utils.reset(memberID, guildID);
                        memberData = DefaultObject_1.default;
                        return;
                    }
                    const level = this.database.fetch(`${guildID}.${memberID}.level`);
                    const memberMultiplier = this.database.fetch(`${guildID}.${memberID}.multiplier`);
                    const userXP = this.database.fetch(`${guildID}.${memberID}.xp`);
                    const userMaxXP = this.database.fetch(`${guildID}.${memberID}.maxXP`);
                    const settingsEXP = this.settings.get('xp', guildID);
                    const settingsXP = Array.isArray(settingsEXP) ? Math.floor(Math.random() * (settingsEXP[1] - settingsEXP[0] + 1)) + settingsEXP[0] : settingsEXP;
                    const xp = Array.isArray(options.xp) ? Math.floor(Math.random() * (options.xp[1] - options.xp[0] + 1)) + options.xp[0] : options.xp;
                    const multiplier = memberMultiplier == 1 ? options.multiplier : memberMultiplier;
                    const memberXP = xp * multiplier;
                    const newLevel = level + 1;
                    this.xp.add(memberXP, memberID, guildID, true);
                    this.totalXP.add(memberXP, memberID, guildID, true);
                    this.database.set(`${guildID}.${memberID}.difference`, (userMaxXP - userXP) - settingsXP);
                    if (memberData.xp >= memberData.maxXP || memberXP > memberData.maxXP) {
                        const newMaxXP = options.maxXP * newLevel;
                        this.xp.set(0, memberID, guildID, true);
                        this.levels.add(1, memberID, guildID, true);
                        this.database.set(`${guildID}.${memberID}.maxXP`, newMaxXP);
                        this.database.set(`${guildID}.${memberID}.difference`, newMaxXP);
                        this.emit('levelUp', {
                            guildID,
                            user: message.author,
                            level: newLevel,
                            maxXP: newMaxXP,
                            multiplier,
                            sendMessage: (msg, channel) => {
                                const type = this.utils.typeOf(msg);
                                let messageOptions;
                                let textChannel;
                                switch (type) {
                                    case 'String':
                                        messageOptions = {
                                            content: msg
                                        };
                                        break;
                                    case 'Object':
                                        messageOptions = msg;
                                        break;
                                    case 'EmbedBuilder':
                                        messageOptions = {
                                            embeds: [
                                                msg
                                            ]
                                        };
                                        break;
                                    case 'AttachmentBuilder':
                                        messageOptions = {
                                            files: [
                                                messageOptions
                                            ]
                                        };
                                        break;
                                    default:
                                        throw new LevelingError_1.default(Errors_1.default.sendMessage.invalidTypes.msg + type);
                                }
                                if (channel) {
                                    const channelType = this.utils.typeOf(channel);
                                    switch (channelType) {
                                        case 'String':
                                            textChannel = this.client.channels.cache.get(channel);
                                            break;
                                        case 'Channel':
                                            textChannel = channel;
                                            break;
                                        case 'TextChannel':
                                            textChannel = channel;
                                            break;
                                        default:
                                            throw new LevelingError_1.default(Errors_1.default.sendMessage.invalidTypes.channel + channelType);
                                    }
                                    if (!textChannel)
                                        throw new LevelingError_1.default(Errors_1.default.sendMessage.channelNotFound);
                                    return textChannel.send(messageOptions);
                                }
                                return message.channel.send(messageOptions);
                            }
                        });
                    }
                }
            }
        });
        return true;
    }
}
module.exports = Leveling;

// ---------------------------------------
// Typedefs area starts here...
// ---------------------------------------

/**
 * @typedef {Object} VersionData
 * @property {Boolean} updated Is the module updated.
 * @property {installedVersion} installedVersion Version of module that you have installed.
 * @property {packageVersion} packageVersion Latest version of the module.
*/

/**
 * @typedef {Object} RankData
 * @property {UserData} userData User's data object.
 * @property {Number} level User's level
 * @property {Number} xp User's amount of XP.
 * @property {Number} totalXP User's total amount of XP.
 * @property {Number} maxXP How much XP in total the user need to reach the next level.
 * @property {Number} difference The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
 * @property {Number} multiplier XP Multiplier.
*/

/**
 * @typedef {Object} LeaderboardData Leaderboard data object.
 * @property {String} userID User's ID.
 * @property {Number} level User's level.
 * @property {Number} xp User's amount of XP.
 * @property {Number} totalXP User's amount of total XP.
 * @property {Number} maxXP User's data object.
 * @property {User} user User's data object.
 * @property {Number} difference User's amount of total XP.
 * @property {Number} multiplier XP Multiplier.
*/

/**
 * @typedef {Object} LevelingOptions Default Leveling options.
 * @property {String} [storagePath='./leveling.json'] Full path to a JSON file. Default: './leveling.json'.
 * @property {Boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {Boolean} [ignoreBots=true] If true, every message from bots won't give them XP. Default: true.
 * @property {Number} [xp=5] Amount of XP that user will receive after sending a message. Default: 5.
 * @property {Boolean} [status=true] You can enable or disable the leveling system using this option. Default: true.
 * @property {Number} [maxXP=300] Amount of XP that user will totally need to reach the next level. This value will double for each level. Default: 300.
 * @property {String[]} [lockedChannels=[]] Array of channel IDs that won't give XP to users. Default: [].
 * @property {String[]} [ignoredGuilds=[]] Array of guilds on which none of the members will be given XP. Default: [].
 * @property {Boolean} [multiplier=1] XP multiplier. Default: 1.
 * @property {FilterFunction} [filter=() => true] Callback function that must return a boolean value, it will add XP only to authors of filtered messages. Default: null.
 * @property {Number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {UpdaterOptions} [updater] Update Checker options object.
 * @property {ErrorHandlerOptions} [errorHandler] Error Handler options object.
*/

/**
 * @typedef {Object} UpdaterOptions Updatee options object.
 * @property {Boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @property {Boolean} [upToDateMessage=true] Sends the message in console on start if module is up to date. Default: true.
*/

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {Boolean} [handleErrors=true] Handles all errors on startup. Default: true.
 * @property {Number} [attempts=5] Amount of attempts to load the module. Use 0 for infinity attempts. Default: 5.
 * @property {Number} [time=3000] Time between every attempt to start the module (in ms). Default: 3000.
*/

/**
 * @typedef {Object} CheckerOptions Options object for an 'Leveling.utils.checkOptions' method.
 * @property {Boolean} [ignoreInvalidTypes=false] Allows the method to ignore the options with invalid types. Default: false.
 * @property {Boolean} [ignoreUnspecifiedOptions=false] Allows the method to ignore the unspecified  Default: false.
 * @property {Boolean} [ignoreInvalidOptions=false] Allows the method to ignore the unexisting  Default: false.
 * @property {Boolean} [showProblems=false] Allows the method to show all the problems in the console. Default: false.
 * @property {Boolean} [sendLog=false] Allows the method to send the result in the console. Default: false.
 * @property {Boolean} [sendSuccessLog=false] Allows the method to send the result if no problems were found. Default: false.
*/

/**
 * @typedef {Object} UserData User data object.
 * @property {String} id User's ID.
 * @property {String} username User's username.
 * @property {String} tag User's tag.
 * @property {String} discriminator User's discriminator.
*/

/**
 * @typedef {Object} LevelData
 * @property {Number} xp User's amount of XP.
 * @property {Number} totalXP User's total amount of XP.
 * @property {Number} level User's level.
 * @property {Number} maxXP How much XP in total the user need to reach the next level.
 * @property {Number} difference The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
 * @property {Number} multiplier User's XP multiplier.
 * @property {Boolean} onMessage The value will be true if the event was called on 'messageCreate' bot event.
*/

/**
 * @typedef {Object} XPData
 * @property {String} guildID Guild ID.
 * @property {String} userID User ID.
 * @property {Number} xp User's amount of XP.
 * @property {Number} totalXP User's total amount of XP.
 * @property {Number} level User's level.
 * @property {Number} maxXP How much XP in total the user need to reach the next level.
 * @property {Number} difference The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
 * @property {Number} multiplier User's XP multiplier.
 * @property {Boolean} onMessage The value will be true if the event was called on 'messageCreate' bot event.
*/

/**
 * @typedef {Object} LevelUpData
 * @property {String} guildID Guild ID.
 * @property {User} user The user that reached a new level.
 * @property {Number} level New level.
 * @property {Number} maxXP How much XP in total the user need to reach the next level.
 * @property {Number} difference The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
 * @property {Number} multiplier User's XP multiplier.
 * @property {Boolean} onMessage The value will be true if the event was called on 'messageCreate' bot event.
*/

/**
 * @typedef {Object} SettingsTypes
 * @property {Number} xp Amount of XP that user will receive after sending a message.
 * @property {Number} maxXP Amount of XP that user will totally need to reach the next level. This value will double for each level.
 * @property {Number} multiplier XP multiplier.
 * @property {Boolean} status You can enable or disable the leveling system using this option.
 * @property {String[]} ignoredUsers Array of user IDs that won't give XP.
 * @property {String[]} lockedChannels Array of channel IDs that won't give XP to users.
 * @property {Boolean} ignoreBots If true, every message from bots won't give them XP.
 * @property {String | FilterFunction} filter Callback function that must return a boolean value, it will add XP only to authors of filtered messages.
 */

/**
 * @typedef {Object} SettingsArrays
 * @property {String[]} ignoredUsers Array of user IDs that won't give XP.
 * @property {String[]} lockedChannels Array of channel IDs that won't give XP to users.
 */

/**
 * A function that will send a specified message to a specified channel.
 * @callback SendMessage
 * @param {String | MessageEmbed | MessageAttachment | MessageOptions} msg Message string, embed, attachment or message options.
 * @param {String | Channel} channel Channel or it's ID.
 * @returns {Promise<Message>}
 */

/**
 * Filter function that accepts a message;
 * it must return a boolean value and it will add XP
 * only to authors of filtered messages.;
 * Use 'null' to disable the filter. Default: '() => true'.
 * @callback FilterFunction
 * @param {Message} msg
 * @returns {Boolean} Boolean value.
*/

// ---------------------------------------
// Events area starts here...
// ---------------------------------------

/**
* Emits when the module is ready.
* @event Leveling#ready
* @param {void} data Void event.
*/

/**
* Emits when the module is destroyed.
* @event Leveling#destroy
* @param {void} data Void event.
*/


/**
* Emits when someone's got the next level.
* @event Leveling#levelUp
* @param {LevelUpData} data Level up data object.
*/


/**
* Emits when someone's set the level.
* @event Leveling#setLevel
* @param {LevelData} data Level data object.
*/

/**
* Emits when someone's added the levels.
* @event Leveling#addLevel
* @param {XPData} data Level data object.
*/

/**
* Emits when someone's subtracted the levels.
* @event Leveling#subtractLevel
* @param {LevelData} data Level data object.
*/


/**
* Emits when someone's set the XP.
* @event Leveling#setXP
* @param {LevelData} data Level data object.
*/

/**
* Emits when someone's add the XP.
* @event Leveling#addXP
* @param {XPData} data Level data object.
*/

/**
* Emits when someone's subtracted the XP.
* @event Leveling#subtractXP
* @param {LevelData} data Level data object.
*/


/**
* Emits when someone's set the total XP.
* @event Leveling#setTotalXP
* @param {LevelData} data Level data object.
*/

/**
* Emits when someone's added the total XP.
* @event Leveling#addTotalXP
* @param {XPData} data Level data object.
*/

/**
* Emits when someone's subtracted the total XP.
* @event Leveling#subtractTotalXP
* @param {LevelData} data Level data object.
*/