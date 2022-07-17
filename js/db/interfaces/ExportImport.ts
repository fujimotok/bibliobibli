export interface ExportImport {
  /**
   * Export Json string.
   * @return {string} Json string. If error occured, return ''.
   */
  Export(): Promise<string>

  /**
   * Import Json string.
   * @param {string} json
   * @return {bool} If import success, return true.
   */
  Import(json: string): Promise<boolean>
}
