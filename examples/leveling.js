const { Client } = require('discord.js') // npm i discord.js
const bot = new Client({
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
    intents: [
        'GUILDS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS',
        'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS',
        'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'
    ]
});

const prefix = '!';
const Leveling = require('discord-leveling-super');

const leveling = new Leveling(bot, {
    storagePath: './leveling.json', // Full path to a JSON file. Default: './leveling.json'.
    checkStorage: true, // Checks the if database file exists and if it has errors. Default: true.
    xp: 5, // Amount of XP that user will receive after sending a message. Default: 5.
    maxXP: 300, // Amount of XP that user will need to reach the next level. This value will double for each level. Default: 300.
    status: true, // You can enable or disable the leveling system using this option. Default: true.
    lockedChannels: [], // Array of channel IDs that won't give XP to users. Default: [].
    ignoredUsers: [], // Array of user IDs that won't give XP. Default: [].
    ignoreBots: true, // If true, every message from bots won't give them XP. Default: true.

    /**
     * Filter function that accepts a message; 
     * it must return a boolean value and it will add XP 
     * only to authors of filtered messages.; 
     * Use 'null' to disable the filter. 
     * 
     * Default: '() => true'.
     */
    filter: msg => !msg.content.startsWith(prefix),
    updater: {
        checkUpdates: true, // Sends the update state message in console on start. Default: true.
        upToDateMessage: true // Sends the message in console on start if module is up to date. Default: true.
    },
    errorHandler: {
        handleErrors: true, // Handles all errors on start. Default: true.
        attempts: 5, // Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5.
        time: 3000 // Time between every attempt to start the module. Default: 3000.
    },
    optionsChecker: {
        ignoreInvalidTypes: false, // Allows the method to ignore the options with invalid types. Default: false.
        ignoreUnspecifiedOptions: false, // Allows the method to ignore the unspecified options. Default: false.
        ignoreInvalidOptions: false, // Allows the method to ignore the unexisting options. Default: false.
        showProblems: false, // Allows the method to show all the problems in the console. Default: false.
        sendLog: false, // Allows the method to send the result in the console. Default: false.
        sendSuccessLog: false // Allows the method to send the result if no problems were found. Default: false.
    }
});

leveling.on('levelUp', data => {
    data.sendMessage(`Congrats, ${data.user}, you just reached the level **${data.level}**!`)
})

bot.on('message', async message => {
    if (message.content.startsWith(prefix + 'help')) {
        return message.channel.send(
            `Commands:
${prefix}help
${prefix}rank (${prefix}ranks)
${prefix}leaderboard (${prefix}lb)`
        )
    }

    if (message.content.startsWith(prefix + 'rank') || message.content.startsWith(prefix + 'ranks')) {
        const args = message.content.split(' ').slice(1)

        const member = message.mentions.members.first()?.user || 
        message.guild.members.cache.get(args[0])?.user || 
        message.guild.members.cache.find(x => x.user.username.toLowerCase() == args.join(' ').toLocaleLowerCase())?.user || 
        message.guild.members.cache.find(x => x.displayName.toLowerCase() == args.join(' ').toLocaleLowerCase())?.user || 
        message.author

        const isOnTheServer = member ? '\n' : '\nNot on the server.\n'

        const {
            level, xp, maxXP,
            totalXP, difference, userData
        } = leveling.ranks.get(member.id, message.guild.id)

        if (!userData && !member) return message.channel.send('Cannot find the specified user!')
        return message.channel.send(`**${userData.tag}**${isOnTheServer}**------------------------**\nLevel: **${level || 1}**\nXP: **${xp || 0}/${maxXP || 300}**\nTotal XP: **${totalXP || 0}**\nXP until the next level: **${difference || 300}**`)
    }

    if (message.content.startsWith(prefix + 'leaderboard') || message.content.startsWith(prefix + 'lb')) {
        const ranks = leveling.ranks.leaderboard(message.guild.id)
        const leaderboard = ranks.map((x, i) => `**${i + 1}** - **${x.userData.tag}** ${x.user ? '' : '(X)'} - Level **${x.level}**, **${x.xp}** XP`).join('\n')

        return message.channel.send(leaderboard)
    }
})

bot.on('ready', () => {
    bot.user.setActivity('Test!', { type: 'STREAMING', url: 'https://twitch.tv/a' })
    console.log(`${bot.user.tag} is ready!`);
});

bot.login('token') // https://discord.com/developers/applications
