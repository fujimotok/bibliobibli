;; define messages (key . ((lang-key . val) (lang-key . val) ..))
(setq messages
  '(
    ;; book
    (:bookCreateNote
     . ((:en . "Write a note")
        (:ja . "ノートを書く")))
    (:bookDelete
     . ((:en . "Delete")
        (:ja . "削除")))
    (:bookDeleteConfirm
     . ((:en . "Are you sure you want to delete it?")
        (:ja . "本当に削除しても良いですか?")))
    (:bookLinkDeleteConfirm
     . ((:en . "Are you sure you want to delete this link?")
        (:ja . "リンクを本当に削除しても良いですか?")))
    (:bookCreateActivityTitle
     . ((:en . "Created a book info")
        (:ja . "書籍情報作成")))
    (:bookCreateActivityContent
     . ((:en . "%{name} is created.")
        (:ja . "%{name} が作成されました")))
    (:bookUpdateActivityTitle
     . ((:en . "Updated a book info")
        (:ja . "書籍情報更新")))
    (:bookUpdateActivityContent
     . ((:en . "%{name} is updated.")
        (:ja . "%{name} が更新されました")))
    (:bookDeleteActivityTitle
     . ((:en . "Deleted a book info")
        (:ja . "書籍情報削除")))
    (:bookDeleteActivityContent
     . ((:en . "%{name} is deletedd.")
        (:ja . "%{name} が削除されました")))
    ;; note
    (:noteNameChange
     . ((:en . "Change Name")
        (:ja . "名称変更")))
    (:noteDelete
     . ((:en . "Delete")
        (:ja . "削除")))
    (:noteDeleteConfirm
     . ((:en . "Are you sure you want to delete it?")
        (:ja . "本当に削除しても良いですか?")))
    (:noteCreateActivityTitle
     . ((:en . "Created a note")
        (:ja . "ノート作成")))
    (:noteCreateActivityContent
     . ((:en . "%{name} is created.")
        (:ja . "%{name} が作成されました")))
    (:noteUpdateActivityTitle
     . ((:en . "Updated a note")
        (:ja . "ノート更新")))
    (:noteUpdateActivityContent
     . ((:en . "%{name} is updated.")
        (:ja . "%{name} が更新されました")))
    (:noteDeleteActivityTitle
     . ((:en . "Deleted a note")
        (:ja . "ノート削除")))
    (:noteDeleteActivityContent
     . ((:en . "%{name} is deletedd.")
        (:ja . "%{name} が削除されました")))
    ;; scraps
    (:scrapDelete
     . ((:en . "Delete")
        (:ja . "削除")))
    (:scrapDeleteConfirm
     . ((:en . "Are you sure you want to delete it?")
        (:ja . "本当に削除しても良いですか?")))
    (:scrapCreateActivityTitle
     . ((:en . "Created a scrap")
        (:ja . "スクラップ作成")))
    (:scrapCreateActivityContent
     . ((:en . "%{name} is created.")
        (:ja . "%{name} が作成されました")))
    (:scrapUpdateActivityTitle
     . ((:en . "Updated a scrap")
        (:ja . "スクラップ更新")))
    (:scrapUpdateActivityContent
     . ((:en . "%{name} is updated.")
        (:ja . "%{name} が更新されました")))
    (:scrapDeleteActivityTitle
     . ((:en . "Deleted a scrap")
        (:ja . "スクラップ削除")))
    (:scrapDeleteActivityContent
     . ((:en . "%{name} is deleted.")
        (:ja . "%{name} が削除されました")))
    ;; diary
    (:diaryDelete
     . ((:en . "Delete")
        (:ja . "削除")))
    (:diaryDeleteConfirm
     . ((:en . "Are you sure you want to delete it?")
        (:ja . "本当に削除しても良いですか?")))
    (:diaryCreateActivityTitle
     . ((:en . "Created a diary")
        (:ja . "日記作成")))
    (:diaryCreateActivityContent
     . ((:en . "%{name} is created.")
        (:ja . "%{name} が作成されました")))
    (:diaryUpdateActivityTitle
     . ((:en . "Updated a diary")
        (:ja . "日記更新")))
    (:diaryUpdateActivityContent
     . ((:en . "%{name} is updated.")
        (:ja . "%{name} が更新されました")))
    (:diaryDeleteActivityTitle
     . ((:en . "Deleted a diary")
        (:ja . "日記削除")))
    (:diaryDeleteActivityContent
     . ((:en . "%{name} is deleted.")
        (:ja . "%{name} が削除されました")))
    ))

(Defun Filter-Lang (Lang-Key)
  (mapcar #'(lambda (m)
              (cons (car m) (cdr (assoc lang-key (cdr m)))))
          messages))

;; Output massage-en.json, massage-jp.json, etc..
;; json-encode-list is Emacs lisp function. Please Replace your env.
(insert (json-encode-list (filter-lang :ja)))
