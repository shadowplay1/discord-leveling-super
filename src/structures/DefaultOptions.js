"use strict";
const DefaultOptions = {
    storagePath: './leveling.json',
    checkStorage: true,
    xp: 5,
    maxXP: 300,
    multiplier: 1,
    status: true,
    ignoreBots: false,
    lockedChannels: [],
    ignoredUsers: [],
    ignoredGuilds: [],
    filter: () => true,
    updater: {
        checkUpdates: true,
        upToDateMessage: true
    },
    errorHandler: {
        handleErrors: true,
        attempts: 5,
        time: 3000
    },
    optionsChecker: {
        ignoreInvalidTypes: false,
        ignoreUnspecifiedOptions: false,
        ignoreInvalidOptions: false,
        showProblems: false,
        sendLog: false,
        sendSuccessLog: false
    }
};
module.exports = DefaultOptions;
