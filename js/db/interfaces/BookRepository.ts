export type Book = {
  id?: number
  createdAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  updatedAt?: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  isbn: string
  title: string
  authors: string[]
  publisher: string
  publishedAt: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  cover: string
  status: number
  readAt: string // ISO8601 "2022-02-13T02:56:56.188+09:00"
  links: string[]
  tags: number[]
}

export const Status =
{
  want: 0,
  unread: 1,
  reading: 2,
  read: 3
} as const

export interface BookRepository
{
  /**
   * Get book entry by id.
   * @param {number} id
   */
  findById(id: number): Promise<Book | undefined>

  /**
   * Create or Update book entry.
   * @param {Book} book If you want create new entry, Set null in Book.id.
   * @return {Book} When created new entry, Book.id is updated. When updated entry, Book.updateAt is updated.
   */
  store(book: Book): Promise<Book | undefined>

  /**
   * Remove book entry.
   * @param {number} id
   */
  remove(id: number): Promise<void>

  /**
   * Get book entries that matches word and status and tags.
   * @param {string} word Find out if it matches 'isbn' or 'title' or 'authors'.
   * @param {number[]} states Find out if it matches 'status'.
   * @param {number[]} tags Find out if it matches 'tags'.
   * @param {number} offset skip this number of books in response (optional)
   * @param {number} limit number of books per page (optional)
   * @return {Book[], number} books and find count
   */
  find(word: string, states: number[], tags: number[], offset: number, limit: number): Promise<[Book[], number] | undefined>
}
