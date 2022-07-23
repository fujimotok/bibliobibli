export type Note = {
  id?: number
  createdAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  updatedAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  path: string
  content: string
}

export interface NoteRepository
{
  /**
   * Get note entry by id.
   * @param {number} id
   */
  findById(id: number): Promise<Note | undefined>

  /**
   * Create or Update note entry.
   * @param {Note} note If you want create new entry, Set null in Note.id.
   * @return {Note} When created new entry, Note.id is updated. When updated entry, Note.updateAt is updated.
   */
  store(note: Note): Promise<Note | undefined>

  /**
   * Remove note entry.
   * @param {number} id
   */
  remove(id: number): Promise<void>

  /**
   * Get note entries that matches word.
   * @param {string} word Find out if it matches 'content'
   * @param {number} offset skip this number of notes in response (optional)
   * @param {number} limit number of notes per page (optional)
   * @return {Note[], number} notes and find count
   */
  find(word: string, offset: number, limit: number): Promise<[Note[], number] | undefined>
}
