import Dexie from 'dexie'

export const db = new Dexie('bibliobibli')
db.version(1).stores({
  books: '++id, title, *authors, isbn, publisher, publishdt, *tags, status, registerdt, readdt, update, rate, *links, *memos'
})
