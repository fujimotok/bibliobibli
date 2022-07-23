// https://github.com/serratus/quaggaJS/blob/master/src/quagga.js

/**
 * Init
 * @param {object} config - to export from
 * @param {function(Object?)} cb - callback with signature (error)
 */
export function init(config: object, cb: (error?: object) => void): void

/**
 * Set onDetected callback
 * @param {function(Object)} cb - callback with signature (error), where error is null on success
 * @return {void}
 */
export function onDetected(cb: (success: object) => void): void

/**
 * Start
 * @return {void}
 */
export function start(): void

/**
 * Stop
 * @return {void}
 */
export function stop(): void

