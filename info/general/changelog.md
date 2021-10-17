# Discord Leveling Super

[![Downloads](https://img.shields.io/npm/dt/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)
[![Stable Version](https://img.shields.io/npm/v/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)

<b>Discord Leveling Super</b> - Easy and customizable leveling framework for your [Discord Bot](https://discord.js.org/#/).

## ⏰ | Changelog

<b>1.0.0</b>
<ul>
    <li><b>The first version of the module: added leveling methods, events, LevelingError class and type defenitions.</b></li>
</ul>
<b>1.0.1</b>
<ul>
    <li><b>Code optimization.</b></li>
    <li><b>Fixed typos.</b></li>
</ul>
<b>1.0.2</b>
<ul>
    <li><b>Code optimization.</b></li>
    <li><b>Fixed typos.</b></li>
    <li><b>Fixed bugs.</b></li>
    <li><b>Added an events example, updated and fixed other examples.</b></li>
    <li><b>Now every event is returning a guild ID and user ID with other properties and 'levelUp' event is also returns a guild ID.</b></li>
</ul>
<b>1.0.3</b>
<ul>
    <li><b>Full rewrite on TypeScript.</b></li>
    <li><b>Code optimization.</b></li>
    <li><b>Fixed typos.</b></li>
    <li><b>Fixed bugs.</b></li>
    <li><b>Added managers.</b></li>
    <li><b>Added a new Database Manager.</b></li>
    <li><b>Now you can setup the module on different guilds using the brand new Settings Manager.</b></li>
    <li><b>Now this module has a <a href="https://dls-docs.tk">documentation website</a>!</b></li>
    <li><b>... and many more!</b></li>
    <b>Here's the changes you need to make in your code:</b>
</ul>
<b>1.0.4</b>
<ul>
    <li><b>Fixed startup issues.</b></li>
    <li><b>TypeScript Examples!</b></li>
    <li><b>Code optimization.</b></li>
</ul>

```diff
- leveling.checkUpdates()
- leveling.all()
- leveling.clearStorage()
- leveling.removeGuild(guildID)
- leveling.removeUser(memberID. guildID)

+ leveling.utils.checkUpdates()
+ leveling.utils.all()
+ leveling.utils.clearStorage()
+ leveling.utils.removeGuild(guildID)
+ leveling.utils.removeUser(memberID. guildID)


- leveling.setXP(xp, memberID, guildID)
- leveling.addXP(xp, memberID, guildID)

+ leveling.xp.set(xp, memberID, guildID)
+ leveling.xp.add(xp, memberID, guildID)
+ leveling.xp.subtract(xp, memberID, guildID)


- leveling.setTotalXP(xp, memberID, guildID)
- leveling.addTotalXP(xp, memberID, guildID)

+ leveling.totalXP.set(xp, memberID, guildID)
+ leveling.totalXP.add(xp, memberID, guildID)
+ leveling.totalXP.subtract(xp, memberID, guildID)


- leveling.setLevel(xp, memberID, guildID)
- leveling.addLevel(xp, memberID, guildID)

+ leveling.totalXP.set(xp, memberID, guildID)
+ leveling.totalXP.add(xp, memberID, guildID)
+ leveling.totalXP.subtract(xp, memberID, guildID)


- leveling.rank(memberID, guildID)
- leveling.leaderboard(memberID, guildID)
    
+ leveling.ranks.get(memberID, guildID)
+ leveling.ranks.leaderboard(memberID, guildID)

- leveling.errors

+ leveling.LevelingError

+ leveling.fetcher
+ leveling.database
+ leveling.settings
```

<br>
<b>If you found a bug, have any questions or need help, join the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for using Discord Leveling Super ❤️