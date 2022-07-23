import {Book, Status, BookRepository} from "../../interfaces/BookRepository"
import {db} from "./BIBLIoBIBLIDatabase"

export class BookRepositoryDexie implements BookRepository
{
  /**
   * Get book entry by id.
   * @param {number} id
   */
  async findById(id: number): Promise<Book | undefined>
  {
    return await db.books
      .get(id)
      .then((book: Book | undefined) => {
        return book
      })
      .catch(() => {
        return undefined
      })
  }

  /**
   * Create or Update book entry.
   * @param {Book} book If you want create new entry, Set null in Book.id.
   * @return {Book} When created new entry, Book.id is updated. When updated entry, Book.updateAt is updated.
   */
  async store(book: Book): Promise<Book | undefined>
  {
    const dt = new Date()
    const tz = -dt.getTimezoneOffset() / 60
    const sign = Math.sign(tz) < 0 ? '-' : '+'
    const now = dt.toISOString().substr(0, 23)
                + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'

    let before: Book | undefined
    if (book.id && (before = await this.findById(book.id)))
    {
      if (before.status !== Status.read
          && book.status === Status.read)
      {
        book.readAt = now
      }
      book.updatedAt = now
      await db.books.update(book.id, book)
      return await this.findById(book.id)
    }
    else
    {
      book.createdAt = now
      book.updatedAt = now
      delete book.id // To set id automatically.
      const addedId = await db.books.add(book)
      return await this.findById(addedId)
    }
  }

  /**
   * Remove book entry.
   * @param {number} id
   */
  async remove(id: number): Promise<void>
  {
    return await db.books.delete(id)
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
  async find(word: string, states: number[], tags: number[], offset: number = 0, limit: number = 0): Promise<[Book[], number] | undefined>
  {
    const words = word.split(' ')
    const regex = new RegExp(words.join('|'), 'i')
    const collection = db.books.orderBy(':id').reverse().filter((book) => {
      const hitWord = regex.test(book.title)
        || regex.test(book.isbn)
        || book.authors.some((author) => regex.test(author))
      const hitStatus = states.includes(book.status)
      const hitTags = tags.length !== 0 ? tags.every(tag => book.tags.includes(tag)) : true
      return hitWord && hitStatus && hitTags
    })
    const count = await collection.count()

    const items = (limit > 0)
      ? await collection.offset(offset).limit(limit).toArray()
      : await collection.offset(offset).toArray()

    return [items, count]
  }
}
