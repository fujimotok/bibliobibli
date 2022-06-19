export type Scrap = {
  readonly id: number
  readonly createdAt: Date
  readonly updatedAt: Date
  tags: number[]
  content: string
}

export interface ScrapRepository
{
  /**
   * Get scrap entry by id.
   * @param {number} id
   */
  findById(id: number): Promise<Scrap | undefined>

  /**
   * Create or Update scrap entry.
   * @param {Scrap} scrap If you want create new entry, Set null in Scrap.id.
   * @return {Scrap} When created new entry, Scrap.id is updated. When updated entry, Scrap.updateAt is updated.
   */
  store(scrap: Scrap): Promise<Scrap | undefined>

  /**
   * Remove scrap entry.
   * @param {number} id
   */
  remove(id: number): Promise<void>

  /**
   * Get scrap entries that matches word and tags.
   * @param {string} word Find out if it matches 'content'.
   * @param {number[]} tags Find out if it matches 'tags'.
   * @param {number} offset skip this number of scraps in response (optional)
   * @param {number} limit number of scraps per page (optional)
   * @return {Scrap[], number} scraps and find count
   */
  find(word: string, tags: number[], offset: number, limit: number): Promise<[Scrap[], number] | undefined>
}
