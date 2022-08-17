import { EventEmitter } from 'events'
import { LevelingEvents } from '../../typings/interfaces/LevelingEvents'

const emitter = new EventEmitter()

/**
 * Simple Leveling event emitter with only important emitter methods.
 * @private
 */
class Emitter {
    
    /**
    * Simple Leveling event emitter with only important emitter methods.
    * @private
    */
    constructor() {}
    
    /**
     * Listens to the event.
     * @param {keyof LevelingEvents} event Event name.
     * @param {(...args: LevelingEvents[K][]) => void} listener Listener function.
     */
    on<K extends keyof LevelingEvents>(event: K, listener: (...args: LevelingEvents[K][]) => void): this {
        emitter.on(event, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {keyof LevelingEvents} event Event name.
     * @param {(...args: LevelingEvents[K][]) => void} listener Listener function.
     */
    once<K extends keyof LevelingEvents>(event: K, listener: (...args: LevelingEvents[K][]) => void): this {
        emitter.once(event, listener)
        return this
    }
    
    /**
     * Emits the event.
     * @param {keyof LevelingEvents} event Event name.
     * @param {LevelingEvents[K][]} args Listener arguments.
     */
    emit<K extends keyof LevelingEvents>(event: K, ...args: LevelingEvents[K][]): boolean {
        return emitter.emit(event, ...args)
    }
}

export = Emitter