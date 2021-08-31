# Discord Leveling Super

[![Downloads](https://img.shields.io/npm/dt/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)
[![Stable Version](https://img.shields.io/npm/v/discord-leveling-super?style=for-the-badge)](https://www.npmjs.com/package/discord-leveling-super)

<b>Discord Leveling Super</b> - Easy and customizable leveling framework for your [Discord Bot](https://discord.js.org/#/).

## ❓ | Frequently Asked Questions

### Q: Will the module support MongoDB?
#### A: No. At the moment, we cant do support for MongoDB in the module. Sorry about that.
<br>

### Q: Why do I get the "Cannot read property '(any manager property from main class)' of null"?
#### A: Because the module is not started and not ready yet. if you have a command handler, you have to do `<client>.leveling = leveling`, which will add my module in your bot client's property and you could use the module in any command without any errors. For example: `<client>.leveling.ranks.get(...)` will return you a user's rank object.
<br>

### Q: Why do I get the "SyntaxError: Unexpected token '.' " or any Discord.js related error?
#### A: Because the module is supporting only Node.js v16.6.0 or above and Discord.js 13.1.0 or above. You need to update them to make the module work.
<br>

### Q: Why are examples not working?
#### A: Examples provided in documentation and in GitHub are for one-file bot. See the question above to get more info. If it's a bug, see the question below.
<br>

### Q: I found a bug or have an idea. Where I could submit it?
#### A: On our [Support Server](https://discord.gg/4pWKq8vUnb). We appreciate that!
<br>

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