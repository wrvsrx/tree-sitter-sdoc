(
  (comment) @comment
  (#set! "priority" 110)
)
[
  (heading_marker)
  (heading_content)
] @markup.heading
[
  "{"
  "}"
] @punctuation.bracket
(paragraph) @spell
(listitem_marker) @markup.list
(list_marker) @markup.list
(emphasis) @markup.italic
(strong) @markup.strong
(strikethrough) @markup.strikethrough
(meta_marker) @keyword.directive
(meta_name) @variable.member
(paragraph_marker) @type.builtin
(list_marker) @type.builtin
(todo_marker) @markup.list.unchecked
(done_marker) @markup.list.checked
