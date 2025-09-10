; S-expression block elements
(heading_block) @markup.block
(explicit_paragraph_block) @markup.block
(tag_name) @tag

; Content types
(text_content) @text
(implicit_paragraph) @spell

; Special characters
("{") @punctuation.bracket
("}") @punctuation.bracket

; Semantic highlighting for common tags
((tag_name) @markup.heading
 (#match? @markup.heading "^(title|heading|h[1-6])$"))

((tag_name) @markup.strong
 (#match? @markup.strong "^(bold|strong)$"))

((tag_name) @markup.italic
 (#match? @markup.italic "^(italic|em|emphasis)$"))

((tag_name) @markup.list
 (#match? @markup.list "^(list|item)$"))

((tag_name) @markup.quote
 (#match? @markup.quote "^(quote|blockquote)$"))

((tag_name) @markup.raw
 (#match? @markup.raw "^(code|pre|verbatim)$"))

((tag_name) @markup.link
 (#match? @markup.link "^(link|url|href)$"))

((tag_name) @markup.paragraph
 (#match? @markup.paragraph "^(paragraph|para|p)$"))
