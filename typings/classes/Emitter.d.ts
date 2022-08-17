import { LevelingEvents } from '../../typings/interfaces/LevelingEvents';
/**
 * Simple Leveling event emitter with only important emitter methods.
 * @private
 */
declare class Emitter {
    /**
    * Simple Leveling event emitter with only important emitter methods.
    * @private
    */
    constructor();
    /**
     * Listens to the event.
     * @param {keyof LevelingEvents} event Event name.
     * @param {(...args: LevelingEvents[K][]) => void} listener Listener function.
     */
    on<K extends keyof LevelingEvents>(event: K, listener: (...args: LevelingEvents[K][]) => void): this;
    /**
     * Listens to the event only for once.
     * @param {keyof LevelingEvents} event Event name.
     * @param {(...args: LevelingEvents[K][]) => void} listener Listener function.
     */
    once<K extends keyof LevelingEvents>(event: K, listener: (...args: LevelingEvents[K][]) => void): this;
    /**
     * Emits the event.
     * @param {keyof LevelingEvents} event Event name.
     * @param {LevelingEvents[K][]} args Listener arguments.
     */
    emit<K extends keyof LevelingEvents>(event: K, ...args: LevelingEvents[K][]): boolean;
}
export = Emitter;
