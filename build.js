const { exec, execSync } = require('child_process')
const platform = process.platform

const {
    readFileSync, readdirSync,
    writeFile, copyFile,
    existsSync
} = require('fs')

const package = require('./package.json')

const date = Date.now()
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

const settingsArray = [
    'xp',
    'maxXP',
    'multiplier',
    'status',
    'ignoredUsers',
    'lockedChannels',
    'ignoreBots',
    'filter'
]

const settingsArrays = [
    'ignoredUsers',
    'lockedChannels',
]

function removeBuild() {
    if (existsSync('./dist')) {
        if (platform == 'win32') execSync('del /s /q dist')
        else execSync('rm -rf dist')
    }
}

/**
 * Returns a string that contains the code 
 * and a message in the beginning.
 * 
 * Also you can send the typedefs file in the end
 * of the string.
 * 
 * @param {String} code The code to put.
 * @param {Boolean} sendTypedefs If true, it will put the module typedefs in the end of the string.
 * @param {Boolean} sendDiscordImports If true, it will put the Discod imports after the message.
 * @param {Boolean} sendEvents If true, it will put the module will put it's typedefs in the end of the string.
 * @returns {String} The code to use in any files.
 */
function getCodeWithInfo(code, sendTypedefs = false, sendDiscordImports = false, sendEvents = false) {
    const typedefsText = readFileSync('./typedefs.js').toString().split('// ---------------------------------------').filter(x => x.length).map(x => x.slice(2))

    const typedefs = typedefsText.slice(0, 3).join('\n')
    const events = typedefsText[3]

    return `// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!${sendDiscordImports ?
            `\n\nconst {
    Message, GuildMember, User,
    MessageEmbed, MessageAttachment, Guild,
    MessageOptions, Channel, TextChannel
} = require('discord.js')` : ''}

${code}${sendTypedefs ? `\n// ---------------------------------------\n${typedefs
            .replace('\n', '')
            .replace(
                '// Typedefs area starts here...',
                '// Typedefs area starts here...\n// ---------------------------------------'
            )
            .replace('\n\n// Events area starts here...', '')
            .slice(0, -5)
            }` : ''}${sendEvents ? `\n\n// ---------------------------------------\n// Events area starts here...\n// ---------------------------------------\n${events}` : ''}`
}


console.log(`${colors.blue}Building ${package.name || __dirname.split('\\').slice(-1)}@${package.version || '1.0.0'}...`);

new Promise((resolve, reject) => {
    exec('npm run begin', err => {
        if (err) {
            const buildDate = Date.now()
            const timeTaken = ((buildDate - date) / 1000).toFixed(3)

            console.log()
            console.log(`${colors.red}Build failed:${colors.cyan}`)
            console.log(err)
            console.log()
            console.log(`${colors.yellow}Failed to install TypeScript.`)
            console.log(`Time taken: ${colors.green}${timeTaken}s${colors.yellow}.`)
            return
        }

        exec('npm run buildfiles', (err, stdout) => {
            if (err) {
                const errorLines = stdout.split('\n').slice(4)
                const error = errorLines[0]

                if (!error) {
                    const buildDate = Date.now()
                    const timeTaken = ((buildDate - date) / 1000).toFixed(3)

                    removeBuild()

                    console.log()
                    console.log(`${colors.red}Build failed:${colors.cyan}`)
                    console.log(err)
                    console.log()
                    console.log(`${colors.yellow}An unexpected error has occured.`)
                    console.log(`Time taken: ${colors.green}${timeTaken}s${colors.yellow}.`)
                    console.log(`All build files were cleared.${colors.reset}`)
                }

                const data = error.split('(')
                const file = data[0]

                const lineData = data[1].split(')')[0].split(',')

                const line = lineData[0]
                const symbol = lineData[1]

                const buildDate = Date.now()
                const timeTaken = ((buildDate - date) / 1000).toFixed(3)

                removeBuild()

                console.log()
                console.log(`${colors.red}Build failed:${colors.cyan}`)
                console.log(error)
                console.log()
                console.log(`${colors.yellow}Fix the error at ${colors.green}${file}:${line}:${symbol}${colors.yellow} and try again.`)
                console.log(`Time taken: ${colors.green}${timeTaken}s${colors.yellow}.`)
                console.log(`All build files were cleared.${colors.reset}`)
                return
            }

            copyFile('./LICENSE', './dist/LICENSE', err => {
                if (err) return reject(err)

                const modulePackage = package

                modulePackage.scripts = {
                    test: 'echo "ok" && exit 0',
                    postinstall: 'node install.js',

                    buildfiles: 'tsc',

                    begin: 'npm i typescript'
                }

                writeFile('./dist/package.json', JSON.stringify(modulePackage, null, '\t'), err => {
                    if (err) return reject(err)

                    copyFile('./install.js', './dist/install.js', err => {
                        if (err) return reject(err)

                        copyFile('./index.js', './dist/index.js', err => {
                            if (err) return reject(err)

                            copyFile('./README.md', './dist/README.md', err => {
                                if (err) return reject(err)

                                exec(
                                    'mkdir dist\\typings\\interfaces' +
                                    '&& mkdir dist\\typings\\classes' +
                                    '&& mkdir dist\\typings\\managers',

                                    err => {
                                        if (err && !existsSync('./dist/typings') && !existsSync('./dist/typings/interfaces')) return reject(err)

                                        const interfacesDir = readdirSync('./typings/interfaces')
                                        const classesDir = readdirSync('./typings/classes')
                                        const managersDir = readdirSync('./typings/managers')

                                        for (let i of interfacesDir) {
                                            copyFile(`./typings/interfaces/${i}`, `./dist/typings/interfaces/${i}`, err => {
                                                if (err) return reject(err)
                                            })
                                        }

                                        for (let i of classesDir) {
                                            const fileContent = readFileSync(`./typings/classes/${i}`).toString()
                                            const textContent = getCodeWithInfo(fileContent)

                                            writeFile(`./dist/typings/classes/${i}`, textContent, err => {
                                                if (err) return reject(err)
                                            })
                                        }

                                        for (let i of managersDir) {
                                            const fileContent = readFileSync(`./typings/managers/${i}`).toString()
                                            const textContent = getCodeWithInfo(fileContent)

                                            writeFile(`./dist/typings/managers/${i}`, textContent, err => {
                                                if (err) return reject(err)
                                            })
                                        }


                                        const fileText = readFileSync('./typings/Leveling.d.ts').toString()
                                        const indexText = getCodeWithInfo(fileText)

                                        writeFile(`./dist/typings/Leveling.d.ts`, indexText, err => {
                                            if (err) return reject(err)

                                            const indexFile = readFileSync('./dist/src/index.js').toString()
                                            const indexText = getCodeWithInfo(indexFile, true, true, true)

                                            writeFile('./dist/src/index.js', indexText, err => {
                                                if (err) return reject(err)

                                                const classesDir = readdirSync('./dist/src/classes')
                                                const managersDir = readdirSync('./dist/src/managers')
                                                const structuresDir = readdirSync('./dist/src/structures')

                                                for (let i of classesDir) {
                                                    const fileContent = readFileSync(`./dist/src/classes/${i}`).toString()
                                                        .replaceAll('keyof LevelingEvents', 'String')
                                                        .replaceAll('(...args: LevelingEvents[K][]) => void', 'Function')
                                                        .replaceAll('LevelingEvents[K][]', 'any')

                                                    const textContent = getCodeWithInfo(fileContent)

                                                    writeFile(`./dist/src/classes/${i}`, textContent, err => {
                                                        if (err) return reject(err)

                                                    })
                                                }

                                                for (let i of managersDir) {
                                                    const fileContent = readFileSync(`./dist/src/managers/${i}`).toString()
                                                        .replaceAll('keyof SettingsTypes', settingsArray.map(x => `'${x}'`).join(' | '))
                                                        .replaceAll('SettingsTypes[K]', 'any')
                                                        .replaceAll('keyof SettingsArrays', settingsArrays.map(x => `'${x}'`).join(' | '))
                                                        .replaceAll('SettingsArrays[K]', 'any')

                                                    const textContent = getCodeWithInfo(fileContent, true, true)

                                                    writeFile(`./dist/src/managers/${i}`, textContent, err => {
                                                        if (err) return reject(err)
                                                    })
                                                }

                                                for (let i of structuresDir) {
                                                    const fileContent = readFileSync(`./dist/src/structures/${i}`).toString()
                                                    const textContent = getCodeWithInfo(fileContent)

                                                    writeFile(`./dist/src/structures/${i}`, textContent, err => {
                                                        if (err) return reject(err)
                                                    })
                                                }

                                                exec(platform == 'win32' ? 'rd node_modules\\typescript /s /q' : 'rm -rf node_modules\\typescript', err => {
                                                    if (err) {
                                                        const buildDate = Date.now()
                                                        const timeTaken = ((buildDate - date) / 1000).toFixed(3)

                                                        console.log()
                                                        console.log(`${colors.red}Build failed:${colors.cyan}`)
                                                        console.log(err)
                                                        console.log()
                                                        console.log(`${colors.yellow}Failed to uninstall TypeScript.`)
                                                        console.log(`Time taken: ${colors.green}${timeTaken}s${colors.yellow}.`)
                                                        return
                                                    }

                                                    let pkgContent = readFileSync('./package.json').toString()
                                                        .replace(',\r\n' + '\t\t"typescript": "^4.4.3"', '')

                                                    writeFile('./package.json', pkgContent, err => {
                                                        if (err) return reject(err)

                                                        resolve(true)
                                                    })
                                                })
                                            })
                                        })
                                    })
                            })
                        })
                    })
                })
            })
        })
    })

}).then(() => {
    const buildDate = Date.now()
    const timeTaken = ((buildDate - date) / 1000).toFixed(3)

    console.log()
    console.log(`${colors.yellow}dist/index.js       ${timeTaken}s`)
    console.log(`${colors.green}Module built successfully!${colors.reset}`)
}).catch(err => {
    const buildDate = Date.now()
    const timeTaken = ((buildDate - date) / 1000).toFixed(3)

    removeBuild()

    console.log()
    console.log(`${colors.red}Build failed:${colors.cyan}`)
    console.log(err)
    console.log()
    console.log(`${colors.yellow}An unexpected error has occured.`)
    console.log(`Time taken: ${colors.green}${timeTaken}s${colors.yellow}.`)
    console.log(`All build files were cleared.${colors.reset}`)
})