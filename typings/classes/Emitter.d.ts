// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

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
