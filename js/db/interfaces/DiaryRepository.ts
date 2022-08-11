export type Diary = {
  id?: number
  createdAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  updatedAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  eventAt: string // YYYY-MM-DD "2022-02-13"
  content: string
}

export interface DiaryRepository {
  /**
   * Get diary entry by id.
   * @param {number} id
   * @return {Diary}
   */
  findById(id: number): Promise<Diary | undefined>

  /**
   * Get diary entry by date.
   * @param {string} date
   * @return {Diary}
   */
  findByDate(date: string): Promise<Diary | undefined>

  /**
   * Create or Update diary entry.
   * @param {Diary} diary
   * @return {Diary}
   */
  store(diary: Diary): Promise<Diary | undefined>

  /**
   * Remove diary entry.
   * @param {number} id
   */
  remove(id: number): Promise<void>

  /**
   * Get diary entries that matches word.
   * @param {string} word Find out if it matches 'content'.
   * @param {string} date Find out if it matches 'eventAt'.
   * @param {number} offset skip this number of diaries in response (optional)
   * @param {number} limit number of diaries per page (optional)
   * @return {Diary[], number} diaries and find count
   */
  find(word: string, date: string, offset: number, limit: number): Promise<[Diary[], number] | undefined>
}
