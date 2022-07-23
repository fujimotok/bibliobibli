export type Activity = {
  id?: number
  createdAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  link: string
  title: string
  content: string
}

export interface ActivityRepository {
  /**
   * Get activity entry by id.
   * @param {number} id
   */
  findById(id: number): Promise<Activity | undefined>

  /**
   * Create or Update activity entry.
   * @param {Activity} activity If you want create new entry, Set null in Activity.id.
   * @return {Activity} When created new entry, Activity.id is updated. When updated entry, Activity.updateAt is updated.
   */
  store(activity: Activity): Promise<Activity | undefined>

  /**
   * Remove activity entry.
   * @param {number} id
   */
  remove(id: number): Promise<void>

  /**
   * Get activity entries that matches word.
   * @param {string} word Find out if it matches 'name'
   * @param {number} offset skip this number of activitys in response (optional)
   * @param {number} limit number of activitys per page (optional)
   * @return {Activity[], number} activitys and find count
   */
  find(word: string, offset: number, limit: number): Promise<[Activity[], number] | undefined>
}
