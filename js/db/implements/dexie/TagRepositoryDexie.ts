import {Tag, TagRepository} from "../../interfaces/TagRepository"
import {db} from "./BIBLIoBIBLIDatabase"

export class TagRepositoryDexie implements TagRepository
{
  /**
   * Get tag entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Tag | undefined>
  {
    return await db.tags
      .get(id)
      .then((tag: Tag | undefined) => {
        return tag
      })
      .catch(() => {
        return undefined
      })
  }

  /**
   * Create or Update tag entry.
   * @param {Tag} tag If you want create new entry, Set null in Tag.id.
   * @return {Tag} When created new entry, Tag.id is updated. When updated entry, Tag.updateAt is updated.
   */
  async store(tag: Tag): Promise<Tag | undefined>
  {
    const dt = new Date()
    const tz = -dt.getTimezoneOffset() / 60
    const sign = Math.sign(tz) < 0 ? '-' : '+'
    const now = dt.toISOString().substr(0, 23)
                + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'

    if (tag.id && await this.findById(tag.id))
    {
      tag.updatedAt = now
      await db.tags.update(tag.id, tag)
      return await this.findById(tag.id)
    }
    else
    {
      tag.createdAt = now
      tag.updatedAt = now
      delete tag.id // To set id automatically.
      const addedId = await db.tags.add(tag)
      return await this.findById(addedId)
    }
  }

  /**
   * Remove tag entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return await db.tags.delete(id)
  }

  /**
   * Get tag entries that matches word and tags.
   * @param {string} word Find out if it matches 'content'.
   * @param {number} offset skip this number of tags in response (optional)
   * @param {number} limit number of tags per page (optional)
   * @return {Tag[], number} tags and find count
   */
  async find(word: string, offset: number = 0, limit: number = 0): Promise<[Tag[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.tags.orderBy(':id').reverse().filter((tag) => {
      return regex.test(tag.name)
    })
    const count = await collection.count()
    const items = (limit > 0)
      ? await collection.offset(offset).limit(limit).toArray()
      : await collection.offset(offset).toArray()

    return [items, count]
  }
}
