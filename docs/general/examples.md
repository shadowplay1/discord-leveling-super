# Discord Leveling Super

[![Downloads](https://img.shields.io/npm/dt/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)
[![Stable Version](https://img.shields.io/npm/v/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)
[![Build Status](https://github.com/shadowplay1/discord-economy-super/workflows/build/badge.svg)](https://www.npmjs.com/package/discord-leveling-super)

<b>Discord Leveling Super</b> - Manage leveling system in your bot for [Discord](https://old.discordjs.dev/#/).

## Initialation Example

```ts
import { Client, Partials } from 'discord.js'
const { Channel, GuildMember, Message, Reaction, User } = Partials

const client = new Client({
    rest: {
        offset: 0,
        timeout: 120000
    },

    partials: [Channel, GuildMember, Message, Reaction, User],
    intents: [
        'GuildMembers', 'GuildMessages',
        'Guilds', 'GuildEmojisAndStickers', 'GuildIntegrations',
		'GuildMessageReactions', 'MessageContent'
    ]
})
```

## More Leveling Examples...
```ts
console.log('hello world')
```

## ❗ | Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-leveling-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-leveling-super">Frequently Asked Questions</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-leveling-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-leveling-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<br>
<b>If you don't understand something in the documentation or you are experiencing problems, feel free to join our <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Modulе Created by ShadowPlay.</b>

# ❤️ Thanks for choosing Discord Leveling Super ❤️
