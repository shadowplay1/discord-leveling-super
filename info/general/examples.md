# Discord Leveling Super

[![Downloads](https://img.shields.io/npm/dt/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)
[![Stable Version](https://img.shields.io/npm/v/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)

<b>Discord Leveling Super</b> - Easy and customizable leveling framework for your [Discord Bot](https://discord.js.org/#/).

## Simple Example
```js
const { Client } = require('discord.js')
const client = new Client();

const Leveling = require('discord-leveling-super');
const leveling = new Leveling(bot);

client.on('ready', () => {
  console.log(`${client.user.tag} is ready!`);
});

leveling.on('ready', () => {
  console.log(`Leveling is ready!`);
});

client.login('token')
```

## Options Example
```js
const Leveling = require('discord-leveling-super');
new Leveling({
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
```

## Events Example
```js
// level up event
leveling.on('levelUp', data => {
    console.log(`${data.user.tag} just reached the level ${data.level} on server with ID ${data.guildID}.`)
    data.sendMessage(`Congrats, ${data.user}, you just reached the level **${data.level}**!`)
})

// xp events
leveling.on('setXP', data => {
    console.log(`Someone's just set ${data.xp} XP to user with ID ${data.userID} on server with ID ${data.guildID}.`)
})

leveling.on('addXP', data => {
    console.log(`User with ID ${data.userID} just received ${data.xp} XP on server with ID ${data.guildID}.`)
})

leveling.on('subtractXP', data => {
    console.log(`Someone's just subtracted ${data.xp} XP to user with ID ${data.userID} on server with ID ${data.guildID}.`)
})


// level events
leveling.on('setLevel', data => {
    console.log(`Someone's just set level ${data.level} to user with ID ${data.userID} on server with ID ${data.guildID}.`)
})

leveling.on('addLevel', data => {
    if (!data.onMessage) console.log(`Someone's just added ${data.level} levels to user with ID ${data.userID} on server with ID ${data.guildID}.`)
})

leveling.on('subtractLevel', data => {
    console.log(`Someone's just subtracted ${data.level} levels to user with ID ${data.userID} on server with ID ${data.guildID}.`)
})


// total xp events
leveling.on('setTotalXP', data => {
    console.log(`Someone's just set ${data.totalXP} of total XP to user with ID ${data.userID} on server with ID ${data.guildID}.`)
})

leveling.on('addTotalXP', data => {
    console.log(`Someone's just added ${data.totalXP} of total XP to user with ID ${data.userID} on server with ID ${data.guildID}.`)
})

leveling.on('subtractTotalXP', data => {
    console.log(`Someone's just added ${data.totalXP} of total XP to user with ID ${data.userID} on server with ID ${data.guildID}.`)
})

// core events
leveling.on('ready', () => {
    console.log('Leveling is ready!')
})
leveling.on('destroy', () => {
    console.log('Leveling was destroyed.')
})
```
## Rank Command
```js
if (message.content.startsWith('+rank')) {
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
```

## Leaderboard Command
```js
if (message.content.startsWith('+leaderboard') || message.content.startsWith('+lb')) {
    const ranks = leveling.ranks.leaderboard(message.guild.id)
    const leaderboard = ranks.map((x, i) => `**${i + 1}** - **${x.userData.tag}** ${x.user ? '' : '(X)'} - Level **${x.level}**, **${x.xp}** XP`).join('\n')

    return message.channel.send(leaderboard)
}
```

## ❗ | Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-leveling-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-leveling-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-leveling-super/tree/main/examples">Bot Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<b>If you found a bug, have any questions or need help, join the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for using Discord Leveling Super ❤️