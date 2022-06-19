import {db} from "./BIBLIoBIBLIDatabase"
import {Diary, DiaryRepository} from "../../interfaces/DiaryRepository"

export class DiaryRepositoryDexie implements DiaryRepository
{
  /**
   * Get diary entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Diary | undefined>
  {
    return db.diaries
      .get(id)
      .then(async (diary: Diary | undefined) => {
        return diary
      })
  }

  /**
   * Get scrap entry by date.
   * @param {number} date
   */
  async findByDate(date: Date): Promise<Diary | undefined>
  {
    return db.diaries
      .where('eventAt').equals(date).first()
  }

  /**
   * Create or Update diary entry.
   * @param {Diary} diary If you want create new entry, Set null in Diary.id.
   * @return {Diary} When created new entry, Diary.id is updated. When updated entry, Diary.updateAt is updated.
   */
  async store(diary: Diary): Promise<Diary | undefined>
  {
    const isExist = await this.findById(diary.id)

    if (isExist)
    {
      await db.diaries.update(diary.id, diary)
    }
    else
    {
      await db.diaries.add(diary)
    }

    return await this.findById(diary.id)
  }

  /**
   * Remove diary entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return db.diaries.delete(id)
  }

  /**
   * Get diary entries that matches word or event date.
   * @param {string} word Find out if it matches 'content'.
   * @param {Date} date Find out if it matches 'eventAt'.
   * @param {number} offset skip this number of diaries in response (optional)
   * @param {number} limit number of diaries per page (optional)
   * @return {Diary[], number} diaries and find count
   */
  async find(word: string, date: Date, offset: number, limit: number): Promise<[Diary[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.diaries.orderBy(':id').reverse().filter((diary) => {
      const hitWord = regex.test(diary.content)
      const hitDate = diary.eventAt == date
      return hitWord || hitDate
    })
    const count = await collection.count()
    const items = await collection.offset(offset).limit(limit).toArray()
    return [items, count]
  }
}
