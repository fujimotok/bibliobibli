export type Book = {
  readonly id: number
  readonly createdAt: Date
  readonly updatedAt: Date
  isbn: string
  title: string
  authors: string[]
  publisher: string
  publishedAt: Date
  cover: string
  status: number
  readonly readAt: Date
  links: string[]
  notes: number[]
  tags: number[]
}

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
