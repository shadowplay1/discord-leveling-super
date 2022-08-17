declare const LevelingErrors: {
    noClient: string;
    invalidClient: string;
    notReady: string;
    noDependencies: string;
    noDiscordJS: string;
    oldNodeVersion: string;
    oldDJSVersion: string;
    invalidStorage: string;
    wrongStorageData: string;
    invalidTypes: {
        level: string;
        xp: string;
        member: string;
        guild: string;
        multiplier: string;
        value: string;
    };
    settingsManager: {
        invalidKey: string;
        valueNotFound(setting: string, value: string): string;
    };
    databaseManager: {
        invalidTypes: {
            key: string;
            target: {
                number: string;
                array: string;
            };
            value: {
                number: string;
                array: string;
            };
        };
    };
    sendMessage: {
        invalidTypes: {
            msg: string;
            channel: string;
        };
        channelNotFound: string;
        invalidChannelType: string;
    };
    lockedChannels: {
        invalidTypes: string;
        invalidChannels(channelsArray: string[]): string;
    };
    ignoredUsers: {
        invalidTypes: string;
        invalidUsers(usersArray: string[]): string;
    };
    ignoredGuilds: {
        invalidTypes: string;
        invalidGuilds(guildsArray: string[]): string;
    };
    reservedName(name: string): string;
};
export = LevelingErrors;
