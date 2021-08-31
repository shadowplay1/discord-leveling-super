import { existsSync } from 'fs'

import LevelingError from './src/classes/LevelingError'

import errors from './src/structures/Errors'
import modulePackage from './package.json'

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

function moduleVersion(moduleName: string) {
    const modulePath = `./node_modules/${moduleName}/package.json`

    if (!modulePackage.dependencies) return {
        status: false,
        version: null,
        error: errors.noDependencies
    }

    if (!existsSync(modulePath)) return {
        status: false,
        version: null,
        error: errors.noDiscordJS
    }

    const nodeModulePackage = require(modulePath)
    return {
        status: true,
        version: nodeModulePackage.version,
        error: null
    }
}


function sendError(err: string) {
    const error = new LevelingError(err)

    console.log(`${colors.red}Failed to start the module:${colors.cyan}`)
    console.log(error, colors.reset)

    process.exit(1)
}

const djsVersion = moduleVersion('discord.js')
const nodeVersionNumbers = process.version.slice(1).split('.').map(x => Number(x))

function start() {
    if (nodeVersionNumbers[0] < 16 && nodeVersionNumbers[1] < 6) return sendError(errors.oldNodeVersion + process.version)
    if (djsVersion.error) return sendError(djsVersion.error)

    const djsVersionNumbers = djsVersion.version.split('.').map((x: string) => Number(x))
    if (djsVersionNumbers[0] < 13 && djsVersionNumbers[1] < 1) return sendError(errors.oldDJSVersion + djsVersion.version)

    const Leveling = require('./src/index')

    module.exports = Object.assign(Leveling, {
        version: modulePackage.version,
        docs: 'https://dls-docs.tk'
    })
}

start()