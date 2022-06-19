import {db} from "./BIBLIoBIBLIDatabase"
import {Book, BookRepository} from "../../interfaces/BookRepository"

export class BookRepositoryDexie implements BookRepository
{
  /**
   * Get book entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Book | undefined>
  {
    return db.books
      .get(id)
      .then(async (book: Book | undefined) => {
        return book
      })
  }

  /**
   * Create or Update book entry.
   * @param {Book} book If you want create new entry, Set null in Book.id.
   * @return {Book} When created new entry, Book.id is updated. When updated entry, Book.updateAt is updated.
   */
  async store(book: Book): Promise<Book | undefined>
  {
    const isExist = await this.findById(book.id)

    if (isExist)
    {
      await db.books.update(book.id, book)
    }
    else
    {
      await db.books.add(book)
    }

    return await this.findById(book.id)
  }

  /**
   * Remove book entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return db.books.delete(id)
  }

  /**
   * Get book entries that matches word and status and tags.
   * @param {string} word Find out if it matches 'isbn' or 'title' or 'authors'.
   * @param {number[]} states Find out if it matches 'status'.
   * @param {number[]} tags Find out if it matches 'tags'.
   * @param {number} offset skip this number of books in response (optional)
   * @param {number} limit number of books per page (optional)
   * @return {Book[], number} books and find count
   */
  async find(word: string, states: number[], tags: number[], offset: number, limit: number = 20): Promise<[Book[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.books.orderBy(':id').reverse().filter((book) => {
      const hitWord = regex.test(book.title)
        || regex.test(book.isbn)
        || book.authors.some((author) => regex.test(author))
      const hitStatus = states.some(status => book.status === status)
      const hitTags = tags.length !== 0 ? tags.every(tag => book.tags.includes(tag)) : true
      return hitWord && hitStatus && hitTags
    })
    const count = await collection.count()
    const items = await collection.offset(offset).limit(limit).toArray()
    return [items, count]
  }
}
