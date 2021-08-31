// This file was generated automatically!
// I'm not responsible for the quality of this code!

// The module is made in TypeScript.
// See the source code here:
// https://github.com/shadowplay1/discord-leveling-super

// Thanks!

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
     * @param {String} event Event name.
     * @param {Function} listener Listener function.
     */
    on(event, listener) {
        emitter.on(event, listener);
        return this;
    }
    /**
     * Listens to the event only for once.
     * @param {String} event Event name.
     * @param {Function} listener Listener function.
     */
    once(event, listener) {
        emitter.once(event, listener);
        return this;
    }
    /**
     * Emits the event.
     * @param {String} event Event name.
     * @param {any} args Listener arguments.
     */
    emit(event, ...args) {
        return emitter.emit(event, ...args);
    }
}
module.exports = Emitter;
