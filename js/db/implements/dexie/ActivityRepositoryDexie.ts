import {Activity, ActivityRepository} from "../../interfaces/ActivityRepository"
import {db} from "./BIBLIoBIBLIDatabase"

export class ActivityRepositoryDexie implements ActivityRepository
{
  /**
   * Get activity entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Activity | undefined>
  {
    return await db.activities
      .get(id)
      .then((activity: Activity | undefined) => {
        return activity
      })
      .catch(() => {
        return undefined
      })
  }

  /**
   * Get activity entry by uri.
   * @param {string} uri
   */
  async findByURI(uri: string): Promise<Activity | undefined>
  {
    return await db.activities
      .where('link')
      .equals(uri)
      .first()
      .then((activity: Activity | undefined) => {
        return activity
      })
      .catch(() => {
        return undefined
      })
  }

  /**
   * Create or Update activity entry.
   * @param {Activity} activity If you want create new entry, Set null in Activity.id.
   * @return {Activity} When created new entry, Activity.id is updated. When updated entry, Activity.updateAt is updated.
   */
  async store(activity: Activity): Promise<Activity | undefined>
  {
    const dt = new Date()
    const tz = -dt.getTimezoneOffset() / 60
    const sign = Math.sign(tz) < 0 ? '-' : '+'
    const now = dt.toISOString().substr(0, 23)
                + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'

    activity.createdAt = now
    if (activity.id && await this.findById(activity.id))
    {
      activity.createdAt = now
      await db.activities.update(activity.id, activity)
      return await this.findById(activity.id)
    }
    else
    {
      activity.createdAt = now
      delete activity.id // To set id automatically.
      const addedId = await db.activities.add(activity)
      return await this.findById(addedId)
    }
  }

  /**
   * Remove activity entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return await db.activities.delete(id)
  }

  /**
   * Get activity entries that matches word and activitys.
   * @param {string} word Find out if it matches 'content'.
   * @param {number} offset skip this number of activitys in response (optional)
   * @param {number} limit number of activitys per page (optional)
   * @return {Activity[], number} activitys and find count
   */
  async find(word: string, offset: number = 0, limit: number = 0): Promise<[Activity[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.activities.orderBy(':id').reverse().filter((activity: Activity) => {
      return regex.test(activity.title) || regex.test(activity.content)
    })
    const count = await collection.count()
    const items = (limit > 0)
      ? await collection.offset(offset).limit(limit).toArray()
      : await collection.offset(offset).toArray()

    return [items, count]
  }
}
