"use strict";
const events_1 = require("events");
const emitter = new events_1.EventEmitter();
/**
 * Simple Leveling event emitter with only important emitter methods.
 * @private
 */
class Emitter {
    /**
    * Simple Leveling event emitter with only important emitter methods.
    * @private
    */
    constructor() { }
    /**
     * Listens to the event.
     * @param {LevelingEvents} event Event name.
     * @param {Function} listener Listener function.
     */
    on(event, listener) {
        emitter.on(event, listener);
        return this;
    }
    /**
     * Listens to the event only for once.
     * @param {LevelingEvents} event Event name.
     * @param {Function} listener Listener function.
     */
    once(event, listener) {
        emitter.once(event, listener);
        return this;
    }
    /**
     * Emits the event.
     * @param {LevelingEvents} event Event name.
     * @param {Function} args Listener arguments.
     */
    emit(event, ...args) {
        return emitter.emit(event, ...args);
    }
}
module.exports = Emitter;
