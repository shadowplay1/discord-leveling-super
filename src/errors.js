module.exports = {
    noClient: 'Specify the bot client.',
    notReady: 'The module is not ready to work.',
    oldNodeVersion: 'This module is supporting only Node.js v14 or newer. Installed version is ',
    invalidStorage: 'Storage file is not valid.',
    wrongStorageData: 'Storage file contains wrong data.',
    invalidTypes: {
        level: 'level must be a number or string. Received type: ',
        xp: 'xp must be a number or string. Received type: ',
        memberID: 'memberID must be a string. Received type: ',
        guildID: 'guildID must be a string. Received type: ',
        constructorOptions: {
            xp: 'options.xp must be a number or string. Received type: ',
            maxXP: 'options.maxXP must be a number or string. Received type: ',
            lockedChannels: 'options.lockedChannels must be an array of channel IDs. Received type: ',
            status: 'options.status must be a boolean. Received type: ',
            filter: 'options.filter must be a function. Received type: ',
            options: 'options must be type of object. Received: ',
            storatePath: 'options.storagePath must be type of string. Received type: ',
            updaterType: 'options.updater must be type of object. Received: ',
            errorHandlerType: 'options.errorHandler must be type of object. Received: ',
            storatePath: 'options.storagePath must be type of string. Received type: ',
            updateCountdown: 'options.updateCountdown must be type of number. Received type: ',
            errorHandler: {
                handleErrors: 'options.errorHandler.handleErrors must be type of boolean. Received type: ',
                attempts: 'options.errorHandler.attempts must be type of number. Received type: ',
                time: 'options.errorHandler.time must be type of number. Received type: '
            },
            updater: {
                checkUpdates: 'options.updater.checkUpdates must be type of boolean. Received type: ',
                upToDateMessage: 'options.updater.upToDateMessage must be type of boolean. Received type: '
            }
        }
    }
}