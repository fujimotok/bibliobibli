import { ExportImport } from "../../interfaces/ExportImport"
import { db } from "./BIBLIoBIBLIDatabase"
import IDBExportImport from 'indexeddb-export-import'

export class ExportImportDexie implements ExportImport {
  /**
   * Export Json string.
   * @return {string} Json string. If error occured, return ''.
   */
  async Export(): Promise<string>
  {
    await db.open()

    // get native IDBDatabase object from Dexie wrapper
    const idbDatabase = db.backendDB()

    const ret = await new Promise<[object | undefined, string | undefined]>((resolve) => {
      IDBExportImport.exportToJsonString(idbDatabase, (error?: object, jsonString?: string) => {
        resolve([error, jsonString])
      })
    })

    if (ret[0]) {
      return ''
    }

    return ret[1] ? ret[1] : ''
  }

  /**
   * Import Json string.
   * @param {string} json
   * @return {bool} If import success, return true.
   */
  async Import(json: string): Promise<boolean>
  {
    await db.open()

    // get native IDBDatabase object from Dexie wrapper
    const idbDatabase = db.backendDB()

    // clear database before import
    const errClear = await new Promise<object>((resolve) => {
      IDBExportImport.clearDatabase(idbDatabase, (error: object) => { 
        resolve(error)
      })
    })

    if (errClear) {
      return false
    }

    // do import from json
    const errImport = await new Promise<object>((resolve) => {
      IDBExportImport.importFromJsonString(idbDatabase, json, (error: object) => {
        resolve(error)
      })
    })

    if (errImport) {
      return false
    }

    return true
  }
}
