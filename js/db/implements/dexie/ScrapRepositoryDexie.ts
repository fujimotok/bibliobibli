import {Scrap, ScrapRepository} from "../../interfaces/ScrapRepository"
import {db} from "./BIBLIoBIBLIDatabase"

export class ScrapRepositoryDexie implements ScrapRepository
{
  /**
   * Get scrap entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Scrap | undefined>
  {
    return await db.scraps
      .get(id)
      .then((scrap: Scrap | undefined) => {
        return scrap
      })
      .catch(() => {
        return undefined
      })
  }

  /**
   * Create or Update scrap entry.
   * @param {Scrap} scrap If you want create new entry, Set null in Scrap.id.
   * @return {Scrap} When created new entry, Scrap.id is updated. When updated entry, Scrap.updateAt is updated.
   */
  async store(scrap: Scrap): Promise<Scrap | undefined>
  {
    const dt = new Date()
    const tz = -dt.getTimezoneOffset() / 60
    const sign = Math.sign(tz) < 0 ? '-' : '+'
    const now = dt.toISOString().substr(0, 23)
                + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'

    if (scrap.id && await this.findById(scrap.id))
    {
      scrap.updatedAt = now
      await db.scraps.update(scrap.id, scrap)
      return await this.findById(scrap.id)
    }
    else
    {
      scrap.createdAt = now
      scrap.updatedAt = now
      delete scrap.id // To set id automatically.
      const addedId = await db.scraps.add(scrap)
      return await this.findById(addedId)
    }
  }

  /**
   * Remove scrap entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return await db.scraps.delete(id)
  }

  /**
   * Get scrap entries that matches word and tags.
   * @param {string} word Find out if it matches 'content'.
   * @param {number[]} tags Find out if it matches 'tags'.
   * @param {number} offset skip this number of scraps in response (optional)
   * @param {number} limit number of scraps per page (optional)
   * @return {Scrap[], number} scraps and find count
   */
  async find(word: string, tags: number[], offset: number = 0, limit: number = 0): Promise<[Scrap[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.scraps.orderBy(':id').reverse().filter((scrap) => {
      const hitWord = regex.test(scrap.content)
      const hitTags = tags.length !== 0 ? tags.every(tag => scrap.tags.includes(tag)) : true
      return hitWord && hitTags
    })
    const count = await collection.count()
    const items = (limit > 0)
      ? await collection.offset(offset).limit(limit).toArray()
      : await collection.offset(offset).toArray()

    return [items, count]
  }
}
