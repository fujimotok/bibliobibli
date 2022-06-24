import Vue from 'vue'

import { BookRepository } from '../js/db/interfaces/BookRepository'
import { NoteRepository } from '../js/db/interfaces/NoteRepository'
import { ScrapRepository } from '../js/db/interfaces/ScrapRepository'
import { TagRepository } from '../js/db/interfaces/TagRepository'
import { DiaryRepository } from '../js/db/interfaces/DiaryRepository'
import { TodoRepository } from '../js/db/interfaces/TodoRepository'
import { BookRepositoryDexie } from '../js/db/implements/dexie/BookRepositoryDexie'
import { NoteRepositoryDexie } from '../js/db/implements/dexie/NoteRepositoryDexie'
import { ScrapRepositoryDexie } from '../js/db/implements/dexie/ScrapRepositoryDexie'
import { TagRepositoryDexie } from '../js/db/implements/dexie/TagRepositoryDexie'
import { DiaryRepositoryDexie } from '../js/db/implements/dexie/DiaryRepositoryDexie'
import { TodoRepositoryDexie } from '../js/db/implements/dexie/TodoRepositoryDexie'

declare module 'vue/types/vue' {
  interface Vue {
    $bookRepository: BookRepository;
    $noteRepository: NoteRepository;
    $scrapRepository: ScrapRepository;
    $tagRepository: TagRepository;
    $diaryRepository: DiaryRepository;
    $todoRepository: TodoRepository;
  }
}

Vue.prototype.$bookRepository = new BookRepositoryDexie
Vue.prototype.$noteRepository = new NoteRepositoryDexie
Vue.prototype.$scrapRepository = new ScrapRepositoryDexie
Vue.prototype.$tagRepository = new TagRepositoryDexie
Vue.prototype.$diaryRepository = new DiaryRepositoryDexie
Vue.prototype.$todoRepository = new TodoRepositoryDexie
