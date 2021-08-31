# Discord Leveling Super

[![Downloads](https://img.shields.io/npm/dt/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)
[![Stable Version](https://img.shields.io/npm/v/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)

<b>Discord Leveling Super</b> - Easy and customizable leveling framework for your [Discord Bot](https://discord.js.org/#/).

## ✍ | Updating your code

## Version 1.0.3
Version 1.0.3 was rewritten in TypeScript and takes a much more object-oriented approach than previous versions. It also contains many bug fixes, optimizations, methods and support for Discord.js v13 and new Database and Settings Managers.

Here's some examples of methods that were changed in this version:
- `Leveling.rank()` ==> `RanksManager.rank()`
- `Leveling.leaderboard()` ==> `RanksManager.leaderboard()`
- `Leveling.setXP()` ==> `XPManager.set()`
- `Leveling.setTotalXP()` ==> `TotalXPManager.set()`
- `Leveling.all()` ==> `UtilsManager.all()`
<br>

So you have to change your code like this:
- `leveling.rank()` ==> `leveling.ranks.get()`
- `leveling.rank()` ==> `leveling.ranks.leaderboard()`
- `leveling.setXP()` ==> `leveling.xp.set()`
- `leveling.setTotalXP()` ==> `leveling.totalXP.set()`
- `leveling.all()` ==> `leveling.utils.all()`

See the [changelog](https://dls-docs.tk/#/docs/main/1.0.3/general/changelog) for the full list of changes.

## ❗ | Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-leveling-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-leveling-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-leveling-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<b>If you found a bug, have any questions or need help, join the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for using Discord Leveling Super ❤️