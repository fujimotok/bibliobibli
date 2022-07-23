import {Todo, TodoRepository} from "../../interfaces/TodoRepository"
import {db} from "./BIBLIoBIBLIDatabase"

export class TodoRepositoryDexie implements TodoRepository
{
  /**
   * Get todo entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Todo | undefined>
  {
    return await db.todos
      .get(id)
      .then((todo: Todo | undefined) => {
        return todo
      })
      .catch(() => {
        return undefined
      })
  }

  /**
   * Create or Update todo entry.
   * @param {Todo} todo If you want create new entry, Set null in Todo.id.
   * @return {Todo} When created new entry, Todo.id is updated. When updated entry, Todo.updateAt is updated.
   */
  async store(todo: Todo): Promise<Todo | undefined>
  {
    const dt = new Date()
    const tz = -dt.getTimezoneOffset() / 60
    const sign = Math.sign(tz) < 0 ? '-' : '+'
    const now = dt.toISOString().substr(0, 23)
                + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'

    if (todo.id && await this.findById(todo.id))
    {
      todo.updatedAt = now
      await db.todos.update(todo.id, todo)
      return await this.findById(todo.id)
    }
    else
    {
      todo.createdAt = now
      todo.updatedAt = now
      delete todo.id // To set id automatically.
      const addedId = await db.todos.add(todo)
      return await this.findById(addedId)
    }
  }

  /**
   * Remove todo entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return await db.todos.delete(id)
  }

  /**
   * Get todo entries that matches word or event date.
   * @param {string} word Find out if it matches 'content'.
   * @param {Date} date Find out if it matches 'eventAt'.
   * @param {number} offset skip this number of todos in response (optional)
   * @param {number} limit number of todos per page (optional)
   * @return {Todo[], number} todos and find count
   */
  async find(word: string, offset: number = 0, limit: number = 0): Promise<[Todo[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.todos.orderBy(':id').reverse().filter((todo) => {
      return regex.test(todo.content)
    })
    const count = await collection.count()
    const items = (limit > 0)
      ? await collection.offset(offset).limit(limit).toArray()
      : await collection.offset(offset).toArray()

    return [items, count]
  }
}
