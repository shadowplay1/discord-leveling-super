import { ILoggerColors } from '../../../types/misc/colors.interface'
import { version as packageVersion } from '../../../../package.json'

/**
 * Logger class.
 */
export class Logger {

    /**
     * Logger colors.
     * @type {ILoggerColors}
     */
    public colors: ILoggerColors

    /**
     * Debug mode state.
     */
    public debugMode: boolean

    /**
     * Logger constructor.
     * @param {boolean} debug Determines if debug mode is enabled.
    */
    public constructor(debug: boolean) {

        /**
         * Logger colors object.
         * @type {ILoggerColors}
        */
        this.colors = {
            black: '\x1b[30m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            lightgray: '\x1b[37m',
            default: '\x1b[39m',
            darkgray: '\x1b[90m',
            lightred: '\x1b[91m',
            lightgreen: '\x1b[92m',
            lightyellow: '\x1b[93m',
            lightblue: '\x1b[94m',
            lightmagenta: '\x1b[95m',
            lightcyan: '\x1b[96m',
            white: '\x1b[97m',
            reset: '\x1b[0m',
        }

        this.debugMode = debug
    }


    /**
     * Sends an info message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     * @returns {void}
     */
    public info(message: string, color: keyof ILoggerColors = 'cyan'): void {
        console.log(`${this.colors[color]}[Leveling] ${message}${this.colors.reset}`)
    }

    /**
     * Sends an error message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     * @returns {void}
     */
    public error(message: string, color: keyof ILoggerColors = 'red'): void {
        console.error(`${this.colors[color]}[Leveling - Error] ${message}${this.colors.reset}`)
    }

    /**
     * Sends a debug message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='yellow'] Message color to use.
     * @returns {void}
     */
    public debug(message: string, color: keyof ILoggerColors = 'yellow'): void {
        if (!this.debugMode) return
        console.log(`${this.colors[color]}[Leveling] ${message}${this.colors.reset}`)
    }

    /**
     * Sends a warning message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='lightyellow'] Message color to use.
     * @returns {void}
     */
    public warn(message: string, color: keyof ILoggerColors = 'lightyellow'): void {
        console.log(`${this.colors[color]}[Leveling - Warning] ${message}${this.colors.reset}`)
    }

    /**
     * Sends a debug log for the optional parameter in method not specified.
     * @param {string} method The method (e.g. "ShopItem.use") to set.
     * @param {string} parameterName Parameter name to set.
     * @param {any} defaultValue Default value to set.
     * @returns {void}
     */
    public optionalParamNotSpecified(method: string, parameterName: string, defaultValue: any): void {
        this.debug(
            `${method} - "${parameterName}" optional parameter is not specified - defaulting to "${defaultValue}".`,
            'lightcyan'
        )
    }

    /**
     * Check if the module version is development version and send the warning in the console.
     * @returns {void}
     */
    public checkDevVersion(): void {
        if (packageVersion.includes('dev')) {
            console.log()

            this.warn(
                'You are using a DEVELOPMENT version of Leveling, which provides an early access ' +
                'to all the new unfinished features and bug fixes.', 'lightmagenta'
            )

            this.warn(
                'Unlike the stable builds, dev builds DO NOT guarantee that the provided changes are bug-free ' +
                'and won\'t result any degraded performance or crashes. ', 'lightmagenta')

            this.warn(
                'Anything may break at any new commit, so it\'s really important to check ' +
                'the module for new development updates.', 'lightmagenta'
            )

            this.warn(
                'They may include the bug fixes from the ' +
                'old ones and include some new features.', 'lightmagenta'
            )

            this.warn(
                'Use development versions at your own risk.', 'lightmagenta'
            )

            console.log()

            this.warn(
                'Need help? Join the Support Server - https://discord.gg/4pWKq8vUnb.', 'lightmagenta'
            )

            this.warn(
                'Please provide the full version of Leveling you have installed ' +
                '(check in your package.json) when asking for support.', 'lightmagenta'
            )

            console.log()
        }
    }
}
