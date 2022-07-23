// https://github.com/Polarisation/indexeddb-export-import/blob/master/index.js

/**
 * Export all data from an IndexedDB database
 * @param {IDBDatabase} idbDatabase - to export from
 * @param {function(Object?, string?)} cb - callback with signature (error, jsonString)
 */
export function exportToJsonString(idbDatabase: object, cb: (error?: object, jsonString?: string) => void): void

/**
 * Import data from JSON into an IndexedDB database. This does not delete any existing data
 *  from the database, so keys could clash.
 *
 * Only object stores that already exist will be imported.
 *
 * @param {IDBDatabase} idbDatabase - to import into
 * @param {string} jsonString - data to import, one key per object store
 * @param {function(Object)} cb - callback with signature (error), where error is null on success
 * @return {void}
 */
export function importFromJsonString(idbDatabase: object, jsonString: string, cb: (error: object) => void): void

/**
 * Clears a database of all data.
 *
 * The object stores will still exist but will be empty.
 *
 * @param {IDBDatabase} idbDatabase - to delete all data from
 * @param {function(Object)} cb - callback with signature (error), where error is null on success
 * @return {void}
 */
export function clearDatabase(idbDatabase: object, cb: (error: object) => void): void

