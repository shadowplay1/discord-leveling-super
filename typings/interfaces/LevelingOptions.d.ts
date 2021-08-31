import { Message } from 'discord.js'

import CheckerOptions from './CheckerOptions';
import ErrorHandlerOptions from './ErrorHandlerOptions'
import UpdaterOptions from './UpdaterOptions'

/**
 * Constructor options object.
 */
export interface LevelingOptions {

    /**
     * Full path to a JSON file. Default: './leveling.json'.
     */
    storagePath?: string

    /**
     * Checks the if database file exists and if it has errors. Default: true.
     */
    checkStorage?: boolean

    /**
    * Checks for if storage file exists in specified time (in ms). Default: 1000.
    */
    updateCountdown?: number

    /**
     * Amount of XP that user will receive after sending a message. Default: 5.
     */
    xp?: number

    /**
     * Amount of XP that user will need to reach the next level. 
     * This value will double for each level. Default: 300.
     */
    maxXP?: number

    /**
     * You can enable or disable the leveling system using this option. Default: true.
     */
    status?: boolean

    /**
     * XP multiplier. Default: 1.
     */
    multiplier?: number

    /**
     * Array of channel IDs that won't give XP to users. Default: [].
     */
    lockedChannels?: string[]

    /**
     * Array of user IDs that won't give XP. Default: [].
     */
    ignoredUsers?: string[]

    /**
     * Array of guilds on which none of the members will receive XP.
     */
    ignoredGuilds?: string[]

    /**
     * If true, every message from bots won't give them XP. Default: true.
     */
    ignoreBots?: boolean

    /**
     * Filter function that accepts a message; 
     * it must return a boolean value and it will add XP 
     * only to authors of filtered messages.; 
     * Use 'null' to disable the filter. 
     * 
     * Default: '() => true'.
     */
    filter?(msg: Message): boolean

    /**
    * Update Checker options object.
    */
    updater?: UpdaterOptions;

    /**
    * Error Handler options object.
    */
    errorHandler?: ErrorHandlerOptions;

    /**
     * Options object for an 'Leveling.utils.checkOptions' method.
     */
    optionsChecker?: CheckerOptions;
}