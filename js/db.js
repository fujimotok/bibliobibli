import Dexie from 'dexie'

export const db = new Dexie('bibliobibli')
db.version(1).stores({
  books: '++id, title, *authors, isbn, publisher, publishdt, cover, *tags, status, registerdt, readdt, update, rate, *links, *memos',
  tags: '++id, tag'
})
