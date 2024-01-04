try {
    const projectPackage = require('../../package.json')

    if (projectPackage['discord-leveling-super']?.postinstall !== false) {
        console.log()
        console.log('\x1b[32m╔══════════════════════════════════════════════════════════════════════╗')
        console.log('\x1b[32m║ @ discord-leveling-super                                     - [] X ║')
        console.log('\x1b[32m║══════════════════════════════════════════════════════════════════════║')
        console.log('\x1b[32m║ \x1b[36mThank you for installing Discord Leveling Super!                    \x1b[32m║')
        console.log('\x1b[32m║══════════════════════════════════════════════════════════════════════║')
        console.log('\x1b[32m║ If you have any questions or need help, join our Support Server: \x1b[32m    ║')
        console.log('\x1b[32m║ \x1b[34mhttps://discord.gg/4pWKq8vUnb                                        \x1b[32m║')
        console.log('\x1b[32m╚══════════════════════════════════════════════════════════════════════╝\x1b[37m')
        console.log()
    }
} catch {}
