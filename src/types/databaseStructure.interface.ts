
/**
 * An interface containing the structure of the database used in the ILeveling class.
 * @typedef {object} IDatabaseStructure
 */
export interface IDatabaseStructure {
    [guildID: string]: IDatabaseGuild
}

/**
 * An interface containing the structure of the guild object in database.
 * @typedef {object} IDatabaseGuild
 */
export interface IDatabaseGuild {
    any: any
}
