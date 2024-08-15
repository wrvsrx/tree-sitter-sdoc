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
      $.todo_block,
      $.comment,
    ),

    paragraph: ($) => seq('{', $.paragraph_marker, repeat($._inline), '}'),
    section: ($) => seq('{', $.section_marker, optional($.heading), repeat($._block), '}'),
    heading: ($) => seq('{', $.heading_marker, optional($.heading_content), '}'),
    list: ($) => seq('{', $.list_marker, repeat($.listitem), '}'),
    listitem: ($) => seq('{', $.listitem_marker, optional($._blocks_or_inlines), '}'),
    comment: (_) => seq('{%', /([^{}]|\\\}|\\\{)+/, '}'),
    heading_content: ($) => repeat1($._inline),
    todo_block: ($) => seq('{', choice($.todo_block_marker, $.done_block_marker), optional($._blocks_or_inlines), '}'),

    _blocks_or_inlines: ($) => choice(repeat1($._block), repeat1($._inline)),

    _inline: ($) => choice(
      $.word,
      $.softbreak,
      $.emphasis,
      $.strong,
      $.strikethrough,
      $.todo_inline,
      $.link,
    ),
    emphasis: ($) => seq('{', $.emphasis_marker, repeat($._inline), '}'),
    strong: ($) => seq('{', $.strong_marker, repeat($._inline), '}'),
    strikethrough: ($) => seq('{', $.strike_marker, repeat($._inline), '}'),
    todo_inline: ($) => seq('{', choice($.todo_inline_marker, $.done_inline_marker), repeat($._inline), '}'),
    link: ($) => seq('{', $.link_marker, optional(/[ \n\r]+/), optional($.link_label), optional(/[ \n\r]+/), $.link_target, '}'),
    link_label: ($) => seq('{', token.immediate('[]'), repeat($._inline), '}'),
    link_target: (_) => /[^\{\}]+/,

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
    todo_block_marker: (_) => token.immediate('todo'),
    done_block_marker: (_) => token.immediate('done'),
    todo_inline_marker: (_) => token.immediate('o'),
    done_inline_marker: (_) => token.immediate('x'),
    link_marker: (_) => token.immediate('/'),
  },
});
