import Vue from 'vue'

import { BookRepository } from '../js/db/interfaces/BookRepository'
import { NoteRepository } from '../js/db/interfaces/NoteRepository'
import { ScrapRepository } from '../js/db/interfaces/ScrapRepository'
import { TagRepository } from '../js/db/interfaces/TagRepository'
import { DiaryRepository } from '../js/db/interfaces/DiaryRepository'
import { TodoRepository } from '../js/db/interfaces/TodoRepository'
import { ActivityRepository } from '../js/db/interfaces/ActivityRepository'
import { ExportImport } from '../js/db/interfaces/ExportImport'
import { BookRepositoryDexie } from '../js/db/implements/dexie/BookRepositoryDexie'
import { NoteRepositoryDexie } from '../js/db/implements/dexie/NoteRepositoryDexie'
import { ScrapRepositoryDexie } from '../js/db/implements/dexie/ScrapRepositoryDexie'
import { TagRepositoryDexie } from '../js/db/implements/dexie/TagRepositoryDexie'
import { DiaryRepositoryDexie } from '../js/db/implements/dexie/DiaryRepositoryDexie'
import { TodoRepositoryDexie } from '../js/db/implements/dexie/TodoRepositoryDexie'
import { ActivityRepositoryDexie } from '../js/db/implements/dexie/ActivityRepositoryDexie'
import { ExportImportDexie } from '../js/db/implements/dexie/ExportImportDexie'

declare module 'vue/types/vue' {
  interface Vue {
    $bookRepository: BookRepository;
    $noteRepository: NoteRepository;
    $scrapRepository: ScrapRepository;
    $tagRepository: TagRepository;
    $diaryRepository: DiaryRepository;
    $todoRepository: TodoRepository;
    $activityRepository: ActivityRepository;
    $exportImport: ExportImport;
  }
}

// set concrete class.
Vue.prototype.$bookRepository = new BookRepositoryDexie
Vue.prototype.$noteRepository = new NoteRepositoryDexie
Vue.prototype.$scrapRepository = new ScrapRepositoryDexie
Vue.prototype.$tagRepository = new TagRepositoryDexie
Vue.prototype.$diaryRepository = new DiaryRepositoryDexie
Vue.prototype.$todoRepository = new TodoRepositoryDexie
Vue.prototype.$activityRepository = new ActivityRepositoryDexie
Vue.prototype.$exportImport = new ExportImportDexie
