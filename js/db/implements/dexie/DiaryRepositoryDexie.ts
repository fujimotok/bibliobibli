import {Diary, DiaryRepository} from "../../interfaces/DiaryRepository"
import {db} from "./BIBLIoBIBLIDatabase"

export class DiaryRepositoryDexie implements DiaryRepository
{
  /**
   * Get diary entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Diary | undefined>
  {
    return await db.diaries
      .get(id)
      .then((diary: Diary | undefined) => {
        return diary
      })
      .catch(() => {
        return undefined
      })
  }

  /**
   * Get scrap entry by date.
   * @param {number} date
   */
  async findByDate(date: string): Promise<Diary | undefined>
  {
    return await db.diaries
      .where('eventAt').equals(date).first()
  }

  /**
   * Create or Update diary entry.
   * @param {Diary} diary If you want create new entry, Set null in Diary.id.
   * @return {Diary} When created new entry, Diary.id is updated. When updated entry, Diary.updateAt is updated.
   */
  async store(diary: Diary): Promise<Diary | undefined>
  {
    const dt = new Date()
    const tz = -dt.getTimezoneOffset() / 60
    const sign = Math.sign(tz) < 0 ? '-' : '+'
    const now = dt.toISOString().substr(0, 23)
                + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'

    if (diary.id && await this.findById(diary.id))
    {
      diary.updatedAt = now
      await db.diaries.update(diary.id, diary)
      return await this.findById(diary.id)
    }
    else
    {
      diary.createdAt = now
      diary.updatedAt = now
      delete diary.id // To set id automatically.
      const addedId = await db.diaries.add(diary)
      return await this.findById(addedId)
    }
  }

  /**
   * Remove diary entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return await db.diaries.delete(id)
  }

  /**
   * Get diary entries that matches word or event date.
   * @param {string} word Find out if it matches 'content'.
   * @param {string} date Find out if it matches 'eventAt'.
   * @param {number} offset skip this number of diaries in response (optional)
   * @param {number} limit number of diaries per page (optional)
   * @return {Diary[], number} diaries and find count
   */
  async find(word: string, date: string, offset: number = 0, limit: number = 0): Promise<[Diary[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.diaries.orderBy(':id').reverse().filter((diary) => {
      const hitWord = regex.test(diary.content)
      const hitDate = diary.eventAt === date
      return hitWord || hitDate
    })
    const count = await collection.count()
    const items = (limit > 0)
      ? await collection.offset(offset).limit(limit).toArray()
      : await collection.offset(offset).toArray()

    return [items, count]
  }
}
