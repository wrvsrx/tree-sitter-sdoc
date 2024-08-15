module.exports = grammar({
  name: "sdoc",

  conflicts: ($) => [
    [$._block, $.section],
  ],

  rules: {
    document: ($) => seq(optional($.meta), repeat($._block)),

    meta: ($) => seq('{', $.meta_marker, repeat($.meta_block), '}'),
    meta_block: ($) => seq('{', $.meta_name, choice(repeat($._inline), repeat($._block)), '}'),

    _block: ($) => choice(
      $.paragraph,
      $.section,
      $.heading,
      $.list,
      $.todo,
      $.comment,
    ),

    paragraph: ($) => seq('{', $.paragraph_marker, repeat($._inline), '}'),
    section: ($) => seq('{', $.section_marker, optional($.heading), repeat($._block), '}'),
    heading: ($) => seq('{', $.heading_marker, optional($.heading_content), '}'),
    list: ($) => seq('{', $.list_marker, repeat($.listitem), '}'),
    listitem: ($) => seq('{', $.listitem_marker, optional($._blocks_or_inlines), '}'),
    comment: (_) => seq('{%', /([^{}]|\\\}|\\\{)+/, '}'),
    heading_content: ($) => repeat1($._inline),
    todo: ($) => seq('{', choice($.todo_marker, $.done_marker), optional($._blocks_or_inlines), '}'),

    _blocks_or_inlines: ($) => choice(repeat1($._block), repeat1($._inline)),

    _inline: ($) => choice(
      $.word,
      $.softbreak,
      $.emphasis,
      $.strong,
      $.strikethrough,
    ),
    emphasis: ($) => seq('{', $.emphasis_marker, repeat($._inline), '}'),
    strong: ($) => seq('{', $.strong_marker, repeat($._inline), '}'),
    strikethrough: ($) => seq('{', $.strike_marker, repeat($._inline), '}'),

    word: (_) => /([^ {}]|\\\{|\\\})+/,
    meta_name: (_) => /([^ {}]|\\\{|\\\})+/,
    softbreak: (_) => '\n',
    section_marker: (_) => token.immediate('|'),
    heading_marker: (_) => token.immediate('#'),
    paragraph_marker: (_) => token.immediate('p'),
    list_marker: (_) => token.immediate('l'),
    listitem_marker: (_) => token.immediate('-'),
    emphasis_marker: (_) => token.immediate('_'),
    strong_marker: (_) => token.immediate('*'),
    strike_marker: (_) => token.immediate('~'),
    meta_marker: (_) => token.immediate('meta'),
    todo_marker: (_) => token.immediate('todo'),
    done_marker: (_) => token.immediate('done'),
  },
});
