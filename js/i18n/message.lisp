;; define messages (key . ((lang-key . val) (lang-key . val) ..))
(setq messages
  '(
    ;; book
    (:bookLabelTitle
     . ((:en . "Title")
        (:ja . "タイトル")))
    (:bookLabelAuthors
     . ((:en . "Authors")
        (:ja . "著者")))
    (:bookLabelPublisher
     . ((:en . "Publisher")
        (:ja . "出版者")))
    (:bookLabelPublishDate
     . ((:en . "Publish Date")
        (:ja . "出版日")))
    (:bookLabelCover
     . ((:en . "Cover")
        (:ja . "表紙")))
    (:bookLabelTags
     . ((:en . "Tags")
        (:ja . "タグ")))
    (:bookLabelLink
     . ((:en . "Link")
        (:ja . "リンク")))
    (:bookLabelCreatedAt
     . ((:en . "Created at")
        (:ja . "作成日時")))
    (:bookLabelUpdatedAt
     . ((:en . "Updated at")
        (:ja . "更新日時")))
    (:bookLabelStatus
     . ((:en . "Status")
        (:ja . "ステータス")))
    (:bookLabelStatusToRead
     . ((:en . "To Read")
        (:ja . "読みたい")))
    (:bookLabelStatusPurchased
     . ((:en . "Purchased")
        (:ja . "購入済み")))
    (:bookLabelStatusReading
     . ((:en . "Reading")
        (:ja . "読書中")))
    (:bookLabelStatusHaveRead
     . ((:en . "Have Read")
        (:ja . "既読")))
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
    ;; editable-link
    (:editableLinkEmpty
     . ((:en . "Empty")
        (:ja . "空")))
    ;; pages/books Dialog Create
    (:bookDialogCreate
     . ((:en . "Create")
        (:ja . "新規作成")))
    ;; pages/notes Dialog Create
    (:noteDialogCreate
     . ((:en . "Create")
        (:ja . "新規作成")))
    ;; barcode-scanner
    (:barcodeScannerStop
     . ((:en . "Stop scanning")
        (:ja . "スキャンをやめる")))
    ;; settings
    (:settingsTitle
     . ((:en . "Settings")
        (:ja . "設定")))
    (:appearanceTitle
     . ((:en . "Appearance")
        (:ja . "外観")))
    (:themeLabel
     . ((:en . "Theme")
        (:ja . "テーマ")))
    (:importTitle
     . ((:en . "Import & Export")
        (:ja . "インポート & エクスポート")))
    (:importLabelImport
     . ((:en . "Import")
        (:ja . "インポート")))
    (:importLabelExport
     . ((:en . "Export")
        (:ja . "エクスポート")))
    (:importErrorFileNotSupport
     . ((:en . "Your browser does not support File API.")
        (:ja . "お使いのブラウザは File API に対応しておりません。")))
    (:importErrorImportFailed
     . ((:en . "Import failed.")
        (:ja . "インポートに失敗しました。")))
    (:importSuccess
     . ((:en . "Import complete.")
        (:ja . "インポート完了。")))
    (:exportErrorImportFailed
     . ((:en . "Export failed.")
        (:ja . "エクスポートに失敗しました。")))
    ;; about
    (:aboutTitle
     . ((:en . "App info")
        (:ja . "アプリ情報")))
    (:aboutName
     . ((:en . "App Name")
        (:ja . "アプリ名")))
    (:aboutVersion
     . ((:en . "Version")
        (:ja . "バージョン")))
    (:aboutWeb
     . ((:en . "Web")
        (:ja . "ウェブ")))
    ))

(defun filter-lang (lang-key)
  (mapcar #'(lambda (m)
              (cons (car m) (cdr (assoc lang-key (cdr m)))))
          messages))

;; Output massage-en.json, massage-jp.json, etc..
;; json-encode-list is Emacs lisp function. Please Replace your env.
(insert (json-encode-list (filter-lang :ja)))
