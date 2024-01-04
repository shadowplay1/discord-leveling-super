import { ILevelingOptionalConfiguration } from '../types/configurations'

export const defaultConfig: ILevelingOptionalConfiguration = {
    updatesChecker: {
        checkUpdates: true,
        upToDateMessage: false
    },

    configurationChecker: {
        ignoreInvalidTypes: false,
        ignoreUnspecifiedOptions: true,
        ignoreInvalidOptions: false,
        showProblems: true,
        sendLog: true,
        sendSuccessLog: false
    },

    debug: false
}
