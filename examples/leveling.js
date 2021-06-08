const { Client, Intents } = require('discord.js') // npm i discord.js
const bot = new Client({
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
    ws: {
        intents: Intents.ALL
    }
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
    filter: msg => !msg.content.startsWith(prefix), // Callback function that accepts amessage, it must return a boolean value and it will add XP only to authors of filtered messages.; Use 'null' to disable the filter. Default: null.
    updater: {
        checkUpdates: true, // Sends the update state message in console on start. Default: true.
        upToDateMessage: true // Sends the message in console on start if module is up to date. Default: true.
    },
    errorHandler: {
        handleErrors: true, // Handles all errors on start. Default: true.
        attempts: 5, // Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5.
        time: 3000 // Time between every attempt to start the module. Default: 3000.
    }
});

leveling.on('levelUp', data => {
    data.sendMessage(`Congrats, ${data.user}, you just reached the level **${data.level}**!`)
})

bot.on('message', async message => {
    if (message.content.startsWith(prefix + 'help')) return message.channel.send(`Commands:\n${prefix}help\n${prefix}rank (${prefix}ranks)\n${prefix}leaderboard (${prefix}lb)`)
    if (message.content.startsWith(prefix + 'rank') || message.content.startsWith(prefix + 'ranks')) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() == args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() == args.join(' ').toLocaleLowerCase()) || message.author
        const { level, xp, maxXP, totalXP, difference } = leveling.rank(member.id, message.guild.id)
        return message.channel.send(`**${member.tag}**\n**------------------------**\nLevel: **${level || 1}**\nXP: **${xp || 0}/${maxXP || 300}**\nTotal XP: **${totalXP || 0}**\nXP until the next level: **${difference || 300}**`)
    }
    if (message.content.startsWith(prefix + 'leaderboard') || message.content.startsWith(prefix + 'lb')) {
        const ranks = bot.ranks.leaderboard(message.guild.id)
        return message.channel.send(ranks.map(x => `**${x.user.tag}** - Level **${x.level}**, **${x.xp}** XP`).join('\n'))
    }
})

bot.on('ready', () => {
    console.log(`${bot.user.tag} is ready!`);
});

bot.login('token') // https://discord.com/developers/applications