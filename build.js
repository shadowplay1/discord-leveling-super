const { exec, execSync } = require('child_process')
const { platform } = require('os')

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
        if (platform() == 'win32') execSync('rd /s /q dist')
        else execSync('rm -rf dist')
    }

    if (existsSync('./github')) {
        if (platform() == 'win32') execSync('rd /s /q github')
        else execSync('rm -rf github')
    }

    if (existsSync('./docs')) {
        if (platform() == 'win32') execSync('rd /s /q docs')
        else execSync('rm -rf docs')
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

    exec('npm run buildfiles', (err, stdout) => {
        if (err) {
            const errorLines = stdout.split('\n').slice(4)
            const error = errorLines[0]

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
                postinstall: 'node install.js'
            }

            writeFile('./dist/package.json', JSON.stringify(modulePackage, null, '\t'), err => {
                if (err) return reject(err)

                copyFile('./install.js', './dist/install.js', err => {
                    if (err) return reject(err)

                    copyFile('./index.js', './dist/index.js', err => {
                        if (err) return reject(err)

                        copyFile('./npmREADME.md', './dist/README.md', err => {
                            if (err) return reject(err)

                            exec(
                                'mkdir dist\\typings\\interfaces' +
                                '&& mkdir dist\\typings\\classes' +
                                '&& mkdir dist\\typings\\managers' +

                                '&& mkdir docs' +
                                `&& mkdir docs\\${package.version}` +
                                `&& mkdir docs\\${package.version}\\info` +
                                `&& mkdir docs\\${package.version}\\info\\general` +

                                `&& mkdir docs\\${package.version}\\dist` +

                                `&& mkdir docs\\${package.version}\\dist\\src` +
                                `&& mkdir docs\\${package.version}\\dist\\src\\classes` +
                                `&& mkdir docs\\${package.version}\\dist\\src\\managers` +
                                `&& mkdir docs\\${package.version}\\dist\\src\\structures`,

                                err => {
                                    if (err && !existsSync('./dist/typings') && !existsSync('./dist/typings/interfaces')) return reject(err)

                                    const interfacesDir = readdirSync('./typings/interfaces')
                                    const classesDir = readdirSync('./types/src/classes')
                                    const managersDir = readdirSync('./types/src/managers')

                                    for (let i of interfacesDir) {
                                        copyFile(`./typings/interfaces/${i}`, `./dist/typings/interfaces/${i}`, err => {
                                            if (err) return reject(err)
                                        })
                                    }

                                    for (let i of classesDir) {
                                        const fileContent = readFileSync(`./types/src/classes/${i}`).toString()
                                        const textContent = getCodeWithInfo(fileContent)

                                        writeFile(`./dist/typings/classes/${i}`, textContent, err => {
                                            if (err) return reject(err)
                                        })
                                    }

                                    for (let i of managersDir) {
                                        const fileContent = readFileSync(`./types/src/managers/${i}`).toString()
                                        const textContent = getCodeWithInfo(fileContent)

                                        writeFile(`./dist/typings/managers/${i}`, textContent, err => {
                                            if (err) return reject(err)
                                        })
                                    }


                                    const fileText = readFileSync('./types/src/index.d.ts').toString()
                                    const indexText = getCodeWithInfo(fileText)

                                    writeFile(`./dist/typings/Leveling.d.ts`, indexText, err => {
                                        if (err) return reject(err)

                                        const indexFile = readFileSync('./dist/src/index.js').toString()
                                        const indexText = getCodeWithInfo(indexFile, true, true, true)

                                        writeFile('./dist/src/index.js', indexText, err => {
                                            if (err) return reject(err)

                                            writeFile(`./docs/${package.version}/dist/src/index.js`, indexText, err => {
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

                                                        copyFile(`./dist/src/classes/${i}`, `./docs/${package.version}/dist/src/classes/${i}`, err => {
                                                            if (err) return reject(err)
                                                        })
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

                                                        copyFile(`./dist/src/managers/${i}`, `./docs/${package.version}/dist/src/managers/${i}`, err => {
                                                            if (err) return reject(err)
                                                        })
                                                    })
                                                }

                                                for (let i of structuresDir) {
                                                    const fileContent = readFileSync(`./dist/src/structures/${i}`).toString()
                                                    const textContent = getCodeWithInfo(fileContent)

                                                    writeFile(`./dist/src/structures/${i}`, textContent, err => {
                                                        if (err) return reject(err)

                                                        copyFile(`./dist/src/structures/${i}`, `./docs/${package.version}/dist/src/structures/${i}`, err => {
                                                            if (err) return reject(err)
                                                        })
                                                    })
                                                }

                                                exec(
                                                    'mkdir github' +

                                                    '&& mkdir github\\src' +
                                                    '&& mkdir github\\src\\managers' +
                                                    '&& mkdir github\\src\\classes' +
                                                    '&& mkdir github\\src\\structures' +

                                                    '&& mkdir github\\typings' +
                                                    '&& mkdir github\\typings\\interfaces' +
                                                    '&& mkdir github\\typings\\classes' +
                                                    '&& mkdir github\\typings\\managers' +

                                                    '&& mkdir github\\examples',

                                                    err => {
                                                        if (err && !existsSync('./github') && !existsSync('./github/src') && !existsSync('./github/typings') && !existsSync('./github/examples')) return reject(err)

                                                        copyFile('./githubREADME.md', './github/README.md', err => {
                                                            if (err) return reject(err)

                                                            copyFile('./LICENSE', './github/LICENSE', err => {
                                                                if (err) return reject(err)

                                                                copyFile('./install.js', './github/install.js', err => {
                                                                    if (err) return reject(err)

                                                                    copyFile('./build.js', './github/build.js', err => {
                                                                        if (err) return reject(err)

                                                                        copyFile('./build.bat', './github/build.bat', err => {
                                                                            if (err) return reject(err)

                                                                            copyFile('./src/index.ts', './github/src/index.ts', err => {
                                                                                if (err) return reject(err)

                                                                                copyFile('./index.ts', './github/index.ts', err => {
                                                                                    if (err) return reject(err)

                                                                                    copyFile('./index.js', './github/index.js', err => {
                                                                                        if (err) return reject(err)

                                                                                        copyFile('./tsconfig.json', './github/tsconfig.json', err => {
                                                                                            if (err) return reject(err)

                                                                                            copyFile('./typedefs.js', './github/typedefs.js', err => {
                                                                                                if (err) return reject(err)

                                                                                                copyFile('./dist/package.json', './github/package.json', err => {
                                                                                                    if (err) return reject(err)

                                                                                                    const interfacesDir = readdirSync('./dist/typings/interfaces')
                                                                                                    const classesDir = readdirSync('./dist/typings/classes')
                                                                                                    const managersDir = readdirSync('./dist/typings/managers')

                                                                                                    for (let i of interfacesDir) {
                                                                                                        copyFile(`./dist/typings/interfaces/${i}`, `./github/typings/interfaces/${i}`, err => {
                                                                                                            if (err) return reject(err)
                                                                                                        })
                                                                                                    }

                                                                                                    for (let i of classesDir) {
                                                                                                        const fileContent = readFileSync(`./dist/typings/classes/${i}`).toString()

                                                                                                        writeFile(`./github/typings/classes/${i}`, fileContent, err => {
                                                                                                            if (err) return reject(err)
                                                                                                        })
                                                                                                    }

                                                                                                    for (let i of managersDir) {
                                                                                                        const fileContent = readFileSync(`./dist/typings/managers/${i}`).toString()

                                                                                                        writeFile(`./github/typings/managers/${i}`, fileContent, err => {
                                                                                                            if (err) return reject(err)
                                                                                                        })
                                                                                                    }


                                                                                                    const sourceClassesDir = readdirSync('./src/classes')
                                                                                                    const sourceManagersDir = readdirSync('./src/managers')
                                                                                                    const sourceStructuresDir = readdirSync('./src/structures')

                                                                                                    const docsDir = readdirSync('./info/general')
                                                                                                    const examplesDir = readdirSync('./moduleExamples')

                                                                                                    for (let i of sourceClassesDir) {
                                                                                                        copyFile(`./src/classes/${i}`, `./github/src/classes/${i}`, err => {
                                                                                                            if (err) return reject(err)
                                                                                                        })
                                                                                                    }

                                                                                                    for (let i of sourceManagersDir) {
                                                                                                        copyFile(`./src/managers/${i}`, `./github/src/managers/${i}`, err => {
                                                                                                            if (err) return reject(err)
                                                                                                        })
                                                                                                    }

                                                                                                    for (let i of sourceStructuresDir) {
                                                                                                        copyFile(`./src/structures/${i}`, `./github/src/structures/${i}`, err => {
                                                                                                            if (err) return reject(err)
                                                                                                        })
                                                                                                    }


                                                                                                    for (let i of docsDir) {
                                                                                                        if (i !== '1.0.2-welcome.md') copyFile(`./info/general/${i}`, `./docs/${package.version}/info/general/${i}`, err => {
                                                                                                            if (err) return reject(err)
                                                                                                        })
                                                                                                    }

                                                                                                    for (let i of examplesDir) {
                                                                                                        copyFile(`./moduleExamples/${i}`, `./github/examples/${i}`, err => {
                                                                                                            if (err) return reject(err)

                                                                                                            resolve(true)
                                                                                                        })
                                                                                                    }
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

    //removeBuild()

    console.log()
    console.log(`${colors.red}Build failed:${colors.cyan}`)
    console.log(err)
    console.log()
    console.log(`${colors.yellow}An unexpected error has occured.`)
    console.log(`Time taken: ${colors.green}${timeTaken}s${colors.yellow}.`)
    console.log(`All build files were cleared.${colors.reset}`)
})