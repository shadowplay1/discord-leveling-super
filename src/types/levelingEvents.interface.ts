import { Leveling } from '../Leveling'

import { IDatabaseStructure } from './databaseStructure.interface'
import { DatabaseType } from './databaseType.enum'

/**
 * A type containing all the {@link Leveling} events and their return types.
 * 
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that is used.
 * - `TDatabaseKey` ({@link string}, optional: defaults to `${string}.leveling`) - The type of database key that will be used in database operations.
 * - `TDatabaseValue` ({@link any}, optional: defaults to {@link IDatabaseStructure}) - The type of database content that will be used in database operations.
 * 
 * @typedef {object} ILevelingEvents
 * @prop {Leveling<DatabaseType, TDatabaseKey, TDatabaseValue>} ready Emits when the {@link Leveling} module is ready.
 * @prop {void} databaseConnect Emits when the connection to the database is established.
 * 
 * @template TDatabaseType The database type that is used.
 * @template TDatabaseKey The type of database key that will be used in database operations.
 * @template TDatabaseValue The type of database content that will be used in database operations.
 */
export type ILevelingEvents<
    TDatabaseType extends DatabaseType,
    TDatabaseKey extends string = `${string}.leveling`,
    TDatabaseValue = IDatabaseStructure
> = {
    ready: Leveling<TDatabaseType, TDatabaseKey, TDatabaseValue>
    databaseConnect: void
    // [FILL IN]
}
