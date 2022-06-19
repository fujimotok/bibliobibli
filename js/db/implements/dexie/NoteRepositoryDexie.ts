import {db} from "./BIBLIoBIBLIDatabase"
import {Note, NoteRepository} from "../../interfaces/NoteRepository"

export class NoteRepositoryDexie implements NoteRepository
{
  /**
   * Get note entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Note | undefined>
  {
    return db.notes
      .get(id)
      .then(async (note: Note | undefined) => {
        return note
      })
  }

  /**
   * Create or Update note entry.
   * @param {Note} note If you want create new entry, Set null in Note.id.
   * @return {Note} When created new entry, Note.id is updated. When updated entry, Note.updateAt is updated.
   */
  async store(note: Note): Promise<Note | undefined>
  {
    const isExist = await this.findById(note.id)

    if (isExist)
    {
      await db.notes.update(note.id, note)
    }
    else
    {
      await db.notes.add(note)
    }

    return await this.findById(note.id)
  }

  /**
   * Remove note entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return db.notes.delete(id)
  }

  /**
   * Get note entries that matches word.
   * @param {string} word Find out if it matches 'content'
   * @param {number} offset skip this number of notes in response (optional)
   * @param {number} limit number of notes per page (optional)
   * @return {Note[], number} notes and find count
   */
  async find(word: string, offset: number, limit: number): Promise<[Note[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.notes.orderBy(':id').reverse().filter((note) => {
      return regex.test(note.content)
    })
    const count = await collection.count()
    const items = await collection.offset(offset).limit(limit).toArray()
    return [items, count]
  }
}
