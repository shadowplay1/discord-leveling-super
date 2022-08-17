"use strict";
const SettingsArray = [
    'xp',
    'maxXP',
    'multiplier',
    'status',
    'ignoredUsers',
    'lockedChannels',
    'ignoreBots',
    'filter'
];
const LevelingErrors = {
    noClient: 'Specify the bot client.',
    invalidClient: 'Specified client is invalid.',
    notReady: 'The module is not ready to work.',
    noDependencies: 'Cannot find dependencies in your \'package.json\' file.',
    noDiscordJS: 'Discord.js not found!',
    oldNodeVersion: 'This module is supporting only Node.js v16.6.0 or newer. Installed version is ',
    oldDJSVersion: 'This module is supporting only Discord.js v13.1.0 or newer. Installed version is ',
    invalidStorage: 'Storage file is not valid.',
    wrongStorageData: 'Storage file contains wrong data.',
    invalidTypes: {
        level: 'level must be a number or string. Received type: ',
        xp: 'xp must be a number or string. Received type: ',
        member: 'member must be a string or an instance of GuildMember or User. Received type: ',
        guild: 'guild must be a string or an instance of Guild. Received type: ',
        multiplier: 'multiplier must be a string. Received type: ',
        value: 'value must be specified. Received: '
    },
    settingsManager: {
        invalidKey: `You have specified the incorrect settings key. It must be one of the following values:\n${SettingsArray.map(x => `'${x}'`).join(', ')}.\nReceived: `,
        valueNotFound(setting, value) {
            return `Cannot find the value "${value}", in a setting "${setting}".`;
        }
    },
    databaseManager: {
        invalidTypes: {
            key: 'Key must be a string. Received type: ',
            target: {
                number: 'Target is not a number. Received type: ',
                array: 'Target is not an array. Received type: '
            },
            value: {
                number: 'Value is not a number. Received type: ',
                array: 'Value is not an array. Received type: '
            }
        }
    },
    sendMessage: {
        invalidTypes: {
            msg: 'The message must be a string or an object with message options or instance of EmbedBuilder or AttachmentBuilder. Received type: ',
            channel: 'The channel must be a string. Received type: ',
        },
        channelNotFound: 'Cannot find the specified channel.',
        invalidChannelType: 'Cannot send a message in a voice channel or category.'
    },
    lockedChannels: {
        invalidTypes: 'The elements of array of locked channels must be a string. Received: ',
        invalidChannels(channelsArray) {
            if (channelsArray.length == 1)
                return `Cannot find the specified channel: ${channelsArray[0]}`;
            return `Cannot find the ${channelsArray.length} specified channels: ${channelsArray.join(', ')}`;
        }
    },
    ignoredUsers: {
        invalidTypes: 'The elements of array of ignored users must be a string. Received: ',
        invalidUsers(usersArray) {
            if (usersArray.length == 1)
                return `Cannot find the specified user: ${usersArray[0]}`;
            return `Cannot find the ${usersArray.length} specified users: ${usersArray.join(', ')}`;
        }
    },
    ignoredGuilds: {
        invalidTypes: 'The elements of array of ignored guilds must be a string. Received: ',
        invalidGuilds(guildsArray) {
            if (guildsArray.length == 1)
                return `Cannot find the specified guild: ${guildsArray[0]}`;
            return `Cannot find the ${guildsArray.length} specified guilds: ${guildsArray.join(', ')}`;
        }
    },
    reservedName(name) {
        return `'${name}' is a reserved storage file name. You cannot use it.`;
    }
};
module.exports = LevelingErrors;
