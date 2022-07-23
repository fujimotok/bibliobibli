;; define messages (key . ((lang-key . val) (lang-key . val) ..))
(defvar messages
  '(
    (:key1 . ((:en . "val1en")
               (:ja . "val1ja")))
    (:key2 . ((:en . "val2en")
               (:ja . "val2ja")))
    ))

(defun filter-lang (lang-key)
  (mapcar #'(lambda (m)
              (cons (car m) (cdr (assoc lang-key (cdr m)))))
          messages))

;; Output massage-en.json, massage-jp.json, etc..
;; json-encode-list is Emacs lisp function. Please Replace your env.
(json-encode-list (filter-lang :ja))

