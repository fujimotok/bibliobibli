import {db} from "./BIBLIoBIBLIDatabase"
import {Todo, TodoRepository} from "../../interfaces/TodoRepository"

export class TodoRepositoryDexie implements TodoRepository
{
  /**
   * Get todo entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Todo | undefined>
  {
    return db.todos
      .get(id)
      .then(async (todo: Todo | undefined) => {
        return todo
      })
  }

  /**
   * Create or Update todo entry.
   * @param {Todo} todo If you want create new entry, Set null in Todo.id.
   * @return {Todo} When created new entry, Todo.id is updated. When updated entry, Todo.updateAt is updated.
   */
  async store(todo: Todo): Promise<Todo | undefined>
  {
    const isExist = await this.findById(todo.id)

    if (isExist)
    {
      await db.todos.update(todo.id, todo)
    }
    else
    {
      await db.todos.add(todo)
    }

    return await this.findById(todo.id)
  }

  /**
   * Remove todo entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return db.todos.delete(id)
  }

  /**
   * Get todo entries that matches word or event date.
   * @param {string} word Find out if it matches 'content'.
   * @param {Date} date Find out if it matches 'eventAt'.
   * @param {number} offset skip this number of todos in response (optional)
   * @param {number} limit number of todos per page (optional)
   * @return {Todo[], number} todos and find count
   */
  async find(word: string, offset: number, limit: number): Promise<[Todo[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.todos.orderBy(':id').reverse().filter((todo) => {
      return regex.test(todo.content)
    })
    const count = await collection.count()
    const items = await collection.offset(offset).limit(limit).toArray()
    return [items, count]
  }
}
