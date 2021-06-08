# Discord Leveling Super

[![Downloads](https://img.shields.io/npm/dt/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)
[![Stable Version](https://img.shields.io/npm/v/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)

<b>Discord Leveling Super</b> - Easy and customizable leveling framework for your [Discord Bot](https://discord.js.org/#/).

## Install
<b>Please note:</br><b>
<b>Node.js 14.0.0 or newer is required.</b><br>
<b>All types in brackets mean the type of what the method or event returns.</b>
```console
npm i discord-leveling-super
```

## Table of Contents
<ul>
  <li><b><a href="https://www.npmjs.com/package/discord-leveling-super#example-usage">Example Usage</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-leveling-super#constructor-options">Constructor Options</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-leveling-super#module-methods">Module Methods</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-leveling-super#module-properties">Module Properties</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-leveling-super#module-events">Module Events</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-leveling-super#changelog">Changelog</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-leveling-super#useful-links">Useful Links</a></b></li>
</ul>

## Example Usage
<b>Before we start, I will show you a simple example usage for this module.</b>

```js
const { Client, Intents } = require('discord.js') // npm i discord.js
const bot = new Client({
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'], 
    ws: {
        intents: Intents.ALL 
    } 
});

const botPrefix = '!';
const Leveling = require('discord-leveling-super');
const leveling = new Leveling(bot, {
    storagePath: './leveling.json', // Full path to a JSON file. Default: './leveling.json'.
    checkStorage: true, // Checks the if database file exists and if it has errors. Default: true.
    xp: 5, // Amount of XP that user will receive after sending a message. Default: 5.
    maxXP: 300, // Amount of XP that user will need to reach the next level. This value will double for each level. Default: 300.
    status: true, // You can enable or disable the leveling system using this option. Default: true.
    lockedChannels: [], // Array of channel IDs that won't give XP to users. Default: [].
    filter: msg => !msg.content.startsWith(botPrefix), // Callback function that accepts amessage, it must return a boolean value and it will add XP only to authors of filtered messages.; Use 'null' to disable the filter. Default: null.
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

bot.on('ready', () => {
  console.log(`${bot.user.tag} is ready!`);
});

bot.login('token') // https://discord.com/developers/applications
```
<b>Now, let's start!</b>

## Constructor Options
<b>Please note:</b>
<br>
<b>This module requires a Discord Bot Client as the first parameter. Options object is the seconds one.</b>
<ul>
    <li><b>options.storagePath: Full path to a JSON file. Default: './storage.json.' (String)</b></li>
    <li><b>options.checkStorage: Checks for if database file exists and if it has errors. Default: true. (Boolean)</b></li>
    <li><b>options.updateCountdown: Checks for if storage file exists in specified time (in ms). Default: 1000. (Number)</b></li>
    <li><b>options.xp: Amount of XP that user will receive after sending a message. Default: 5. (Number)</b></li>
    <li><b>options.maxXP: Amount of XP that user will totally need to reach the next level. This value will double for each level. Default: 300. (Number)</b></li>
    <li><b>options.status: You can enable or disable the leveling system using this option. Default: true. (Boolean)</b></li>
    <li><b>options.lockedChannels: Array of channel IDs that won't give XP to users. Default: []. (Array)</b></li>
    <li><b>options.filter: Callback function that accepts amessage, it must return a boolean value and it will add XP only to authors of filtered messages.; Use 'null' to disable the filter. Default: null. (Function)</b></li>
    <li><b>options.updater</b>: <b>Update Checker options object:</b>
    <ul>
        <li><b>options.updater.checkUpdates.</b>: <b>Sends the update state message in console on start. Default: true. (Boolean)</b></li>
        <li><b>options.updater.upToDateMessage</b>: <b> Sends the message in console on start if module is up to date. Default: true. (Boolean)</b></li>
    </ul>
    <li><b>options.errorHandler</b>: <b>Error Handler options object:</b>
    <ul>
        <li><b>options.errorHandler.handleErrors.</b>: <b>Handles all errors on startup. Default: true. (Boolean)</b></li>
        <li><b>options.errorHandler.attempts</b>: <b>Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5. (Number)</b></li>
        <li><b>options.errorHandler.time</b>: <b>Time between every attempt to start the module. Default: 3000. (Number)</b></li>
    </ul>
</ul>
<b>Once the module starts, the update checker will show you a beautiful message in your console!</b>

![Up To Date Example](https://cdn.discordapp.com/attachments/764192017542283325/851913394872909844/Screenshot_6.png)

![Out Of Date Example](https://cdn.discordapp.com/attachments/764192017542283325/851913976220090459/Screenshot_6.png)

## Module Methods
<ul>
    <li><b>rank(memberID, guildID): Fetches the user's rank. (Object)</b></li>
    <li><b>leaderboard(guildID): Returns a leaderboard array. (Array)</b></li>
    <br>
    <li><b>setLevel(level, memberID, guildID): Sets the level to specified user. (Object)</b></li>
    <li><b>addLevel(level, memberID, guildID): Adds the level to specified user. (Object)</b></li>
    <br>
    <li><b>setXP(xp, memberID, guildID): Sets the XP to specified user. (Object)</b></li>
    <li><b>addXP(xp, memberID, guildID): Adds the XP to specified user. (Object)</b></li>
    <br>
    <li><b>setTotalXP(xp, memberID, guildID): Sets the total XP to specified user. (Object)</b></li>
    <li><b>addTotalXP(xp, memberID, guildID): Adds the total XP to specified user. (Object)</b></li>
    <br>
    <li><b>all(): Returns the database contents. (Object)</b></li>
    <li><b>checkUpdates(): Checks for if the module is up to date. Returns a promise with data object. (Promise: Object)</b></li>
    <br>
    <li><b>removeGuild(guildID): Fully removes the guild from database. (Boolean)</b></li>
    <li><b>removeUser(memberID, guildID): Removes the user from database. (Boolean)</b></li>
    <br>
    <li><b>clearStorage(): Clears the storage file. (Boolean)</b></li>
    <li><b>kill(): Kills the Leveling instance. (Leveling Instance)</b></li>
    <li><b>init(): Starts the module. (Promise: Boolean)</b></li>
</ul>

## Module Properties
<ul>
<li><b>Leveling.version: Returns the module version. (Boolean)</b></li>
<li><b>Leveling.options: Returns the options object that you put in the Constructor (Object)</b></li>
<li><b>Leveling.LevelingError: Returns the error class that this module is using. (Class)</b></li>
<li><b>Leveling.ready: Module ready status. (Boolean)</b></li>
<li><b>Leveling.errored: Module errored status. (Boolean)</b></li>
<li><b>Leveling.interval: Database checking interval. (NodeJS.Timeout)</b></li>
<li><b>Leveling.errors: Module errors object. (Object)</b></li>
</ul>

## Module Events
<ul>
<li><b>Leveling.on('levelUp'): Emits when someone's reached a new level.</b></li>
<li><b>Leveling.on('setLevel'): Emits when you set the level to someone.</b></li>
<li><b>Leveling.on('addLevel'): Emits when you add levels to someone.</b></li>
<li><b>Leveling.on('setXP'): Emits when you set the XP to someone.</b></li>
<li><b>Leveling.on('addXP'): Emits when you add the XP to someone.</b></li>
<li><b>Leveling.on('setTotalXP'): Emits when you set the total XP to someone.</b></li>
<li><b>Leveling.on('addTotalXP'): Emits when you add the total XP to someone.</b></li>
</ul>

## Changelog
<b>1.0.0</b>
<ul>
    <li><b>The first version of the module: added leveling methods, events, LevelingError class and type defenitions.</b></li>
</ul>

## Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-leveling-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-leveling-super">Github</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-leveling-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/afUTRzfb">Discord Server</a></b></li>
</ul>
<b>If you found a bug, please send it in Discord to ShadowPlay#9706.</b>
<br>
<b>If you have any questions or need help, join the <a href = "https://discord.gg/afUTRzfb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# Thanks for using Discord Leveling Super ♥