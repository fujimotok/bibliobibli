export type Tag = {
  id?: number
  createdAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  updatedAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  name: string
}

export interface TagRepository {
  /**
   * Get tag entry by id.
   * @param {number} id
   */
  findById(id: number): Promise<Tag | undefined>

  /**
   * Create or Update tag entry.
   * @param {Tag} tag If you want create new entry, Set null in Tag.id.
   * @return {Tag} When created new entry, Tag.id is updated. When updated entry, Tag.updateAt is updated.
   */
  store(tag: Tag): Promise<Tag | undefined>

  /**
   * Remove tag entry.
   * @param {number} id
   */
  remove(id: number): Promise<void>

  /**
   * Get tag entries that matches word.
   * @param {string} word Find out if it matches 'name'
   * @param {number} offset skip this number of tags in response (optional)
   * @param {number} limit number of tags per page (optional)
   * @return {Tag[], number} tags and find count
   */
  find(word: string, offset: number, limit: number): Promise<[Tag[], number] | undefined>
}
