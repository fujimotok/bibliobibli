import Dexie from 'dexie'
import { Book } from '../../interfaces/BookRepository'
import { Note } from '../../interfaces/NoteRepository'
import { Scrap } from '../../interfaces/ScrapRepository'
import { Tag } from '../../interfaces/TagRepository'
import { Diary } from '../../interfaces/DiaryRepository'
import { Todo } from '../../interfaces/TodoRepository'
import { Activity } from '../../interfaces/ActivityRepository'

class BIBLIoBIBLIDatabase extends Dexie {
  books!: Dexie.Table<Book, number>
  notes!: Dexie.Table<Note, number>
  scraps!: Dexie.Table<Scrap, number>
  tags!: Dexie.Table<Tag, number>
  diaries!: Dexie.Table<Diary, number>
  todos!: Dexie.Table<Todo, number>
  activities!: Dexie.Table<Activity, number>

  constructor () {
    super('BIBLIoBIBLI')
    this.version(1).stores({
      books: '++id, createdAt, updatedAt, isbn, title, *authors, publisher, publishedAt, cover, status, readAt, *links, *tags',
      notes: '++id, createdAt, updatedAt, path, content',
      scraps: '++id, createdAt, updatedAt, *tags, content',
      tags: '++id, createdAt, updatedAt, name',
      diaries: '++id, createdAt, updatedAt, eventAt, content',
      todos: '++id, createdAt, updatedAt, priority, dueAt, content',
      activities: '++id, createdAt, link, title, content'
    })
  }
}

export const db = new BIBLIoBIBLIDatabase()
