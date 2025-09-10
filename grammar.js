module.exports = grammar({
  name: "sdoc",

  extras: ($) => [/[ \t]/],

  rules: {
    document: ($) => repeat($._element),

    _element: ($) => choice(
      $.block_element,
      $.paragraph,
      $.newline,
    ),

    // S-expression style block elements
    block_element: ($) => seq(
      '{',
      $.tag_name,
      repeat($._content),
      '}',
    ),

    // Plain text paragraphs (no braces required)
    paragraph: ($) => prec(-1, seq(
      repeat1($._para_line),
    )),

    _para_line: ($) => seq(
      /[^{}\n]+/,
      '\n',
    ),

    _content: ($) => choice(
      $.block_element,
      $.text_content,
      $.newline,
    ),

    // Text content within blocks (including quotes)
    text_content: ($) => prec.left(/[^{}\n\s]+/),

    // Tag names for block elements
    tag_name: ($) => /[a-zA-Z][a-zA-Z0-9_]*/,

    newline: ($) => '\n',
  },
});
