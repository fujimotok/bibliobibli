export type Diary = {
  readonly id: number
  readonly createdAt: Date
  readonly updatedAt: Date
  eventAt: Date
  content: string
}

export interface DiaryRepository {
  /**
   * Get diary entry by id.
   * @param {Date} id
   * @return {Diary}
   */
  findById(id: number): Promise<Diary | undefined>

  /**
   * Get diary entry by date.
   * @param {Date} date
   * @return {Diary}
   */
  findByDate(date: Date): Promise<Diary | undefined>

  /**
   * Create or Update diary entry.
   * @param {Diary} diary
   * @return {Diary}
   */
  store(diary: Diary): Promise<Diary | undefined>

  /**
   * Remove diary entry.
   * @param {Date} id
   */
  remove(id: number): Promise<void>

  /**
   * Get diary entries that matches word.
   * @param {string} word Find out if it matches 'content'.
   * @param {Date} date Find out if it matches 'eventAt'.
   * @param {number} offset skip this number of diaries in response (optional)
   * @param {number} limit number of diaries per page (optional)
   * @return {Diary[], number} diaries and find count
   */
  find(word: string, date: Date, offset: number, limit: number): Promise<[Diary[], number] | undefined>
}
