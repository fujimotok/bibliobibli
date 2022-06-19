import {db} from "./BIBLIoBIBLIDatabase"
import {Scrap, ScrapRepository} from "../../interfaces/ScrapRepository"

export class ScrapRepositoryDexie implements ScrapRepository
{
  /**
   * Get scrap entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Scrap | undefined>
  {
    return db.scraps
      .get(id)
      .then(async (scrap: Scrap | undefined) => {
        return scrap
      })
  }

  /**
   * Create or Update scrap entry.
   * @param {Scrap} scrap If you want create new entry, Set null in Scrap.id.
   * @return {Scrap} When created new entry, Scrap.id is updated. When updated entry, Scrap.updateAt is updated.
   */
  async store(scrap: Scrap): Promise<Scrap | undefined>
  {
    const isExist = await this.findById(scrap.id)

    if (isExist)
    {
      await db.scraps.update(scrap.id, scrap)
    }
    else
    {
      await db.scraps.add(scrap)
    }

    return await this.findById(scrap.id)
  }

  /**
   * Remove scrap entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return db.scraps.delete(id)
  }

  /**
   * Get scrap entries that matches word and tags.
   * @param {string} word Find out if it matches 'content'.
   * @param {number[]} tags Find out if it matches 'tags'.
   * @param {number} offset skip this number of scraps in response (optional)
   * @param {number} limit number of scraps per page (optional)
   * @return {Scrap[], number} scraps and find count
   */
  async find(word: string, tags: number[], offset: number, limit: number): Promise<[Scrap[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.scraps.orderBy(':id').reverse().filter((scrap) => {
      const hitWord = regex.test(scrap.content)
      const hitTags = tags.length !== 0 ? tags.every(tag => scrap.tags.includes(tag)) : true
      return hitWord && hitTags
    })
    const count = await collection.count()
    const items = await collection.offset(offset).limit(limit).toArray()
    return [items, count]
  }
}
