import {Note, NoteRepository} from "../../interfaces/NoteRepository"
import {db} from "./BIBLIoBIBLIDatabase"

export class NoteRepositoryDexie implements NoteRepository
{
  /**
   * Get note entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Note | undefined>
  {
    return await db.notes
      .get(id)
      .then((note: Note | undefined) => {
        return note
      })
      .catch(() => {
        return undefined
      })
  }

  /**
   * Create or Update note entry.
   * @param {Note} note If you want create new entry, Set null in Note.id.
   * @return {Note} When created new entry, Note.id is updated. When updated entry, Note.updateAt is updated.
   */
  async store(note: Note): Promise<Note | undefined>
  {
    const dt = new Date()
    const tz = -dt.getTimezoneOffset() / 60
    const sign = Math.sign(tz) < 0 ? '-' : '+'
    const now = dt.toISOString().substr(0, 23)
                + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'

    if (note.id && await this.findById(note.id))
    {
      note.updatedAt = now
      await db.notes.update(note.id, note)
      return await this.findById(note.id)
    }
    else
    {
      note.createdAt = now
      note.updatedAt = now
      delete note.id // To set id automatically.
      const addedId = await db.notes.add(note)
      return await this.findById(addedId)
    }
  }

  /**
   * Remove note entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return await db.notes.delete(id)
  }

  /**
   * Get note entries that matches word.
   * @param {string} word Find out if it matches 'content'
   * @param {number} offset skip this number of notes in response (optional)
   * @param {number} limit number of notes per page (optional)
   * @return {Note[], number} notes and find count
   */
  async find(word: string, offset: number = 0, limit: number = 0): Promise<[Note[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.notes.orderBy(':id').reverse().filter((note) => {
      return regex.test(note.content)
    })
    const count = await collection.count()
    const items = (limit > 0)
      ? await collection.offset(offset).limit(limit).toArray()
      : await collection.offset(offset).toArray()

    return [items, count]
  }
}
