import {db} from "./BIBLIoBIBLIDatabase"
import {Tag, TagRepository} from "../../interfaces/TagRepository"

export class TagRepositoryDexie implements TagRepository
{
  /**
   * Get tag entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Tag | undefined>
  {
    return db.tags
      .get(id)
      .then(async (tag: Tag | undefined) => {
        return tag
      })
  }

  /**
   * Create or Update tag entry.
   * @param {Tag} tag If you want create new entry, Set null in Tag.id.
   * @return {Tag} When created new entry, Tag.id is updated. When updated entry, Tag.updateAt is updated.
   */
  async store(tag: Tag): Promise<Tag | undefined>
  {
    const isExist = await this.findById(tag.id)

    if (isExist)
    {
      await db.tags.update(tag.id, tag)
    }
    else
    {
      await db.tags.add(tag)
    }

    return await this.findById(tag.id)
  }

  /**
   * Remove tag entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return db.tags.delete(id)
  }

  /**
   * Get tag entries that matches word and tags.
   * @param {string} word Find out if it matches 'content'.
   * @param {number} offset skip this number of tags in response (optional)
   * @param {number} limit number of tags per page (optional)
   * @return {Tag[], number} tags and find count
   */
  async find(word: string, offset: number, limit: number): Promise<[Tag[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.tags.orderBy(':id').reverse().filter((tag) => {
      return regex.test(tag.name)
    })
    const count = await collection.count()
    const items = await collection.offset(offset).limit(limit).toArray()
    return [items, count]
  }
}
