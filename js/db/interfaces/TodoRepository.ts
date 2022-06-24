export type Todo = {
  id?: number
  createdAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  updatedAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  priority: number
  dueAt: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  content: string
}

export interface TodoRepository {
  /**
   * Get todo entry by id.
   * @param {number} id
   */
  findById(id: number): Promise<Todo | undefined>

  /**
   * Create or Update todo entry.
   * @param {Todo} todo If you want create new entry, Set null in Todo.id.
   * @return {Todo} When created new entry, Todo.id is updated. When updated entry, Todo.updateAt is updated.
   */
  store(todo: Todo): Promise<Todo | undefined>

  /**
   * Remove todo entry.
   * @param {number} id
   */
  remove(id: number): Promise<void>

  /**
   * Get todo entries that matches word.
   * @param {string} word Find out if it matches 'content'
   * @param {number} offset skip this number of todos in response (optional)
   * @param {number} limit number of todos per page (optional)
   * @return {Todo[], number} todos and find count
   */
  find(word: string, offset: number, limit: number): Promise<[Todo[], number] | undefined>
}
