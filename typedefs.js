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