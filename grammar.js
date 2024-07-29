module.exports = grammar({
  name: "sdoc",

  conflicts: ($) => [
    [$._block, $.section],
  ],

  rules: {
    document: ($) => seq(optional($.meta), repeat($._block)),

    meta: ($) => seq('{', token.immediate('meta'), repeat($.meta_block), '}'),
    meta_block: ($) => seq('{', $.meta_name, choice(repeat($._inline), repeat($._block)), '}'),

    _block: ($) => choice($.paragraph, $.section, $.heading, $.list, $.comment),

    paragraph: ($) => seq('{p', repeat($._inline), '}'),
    section: ($) => seq('{|', optional($.heading), repeat($._block), '}'),
    heading: ($) => seq('{', $.heading_marker, optional($.heading_content), '}'),
    list: ($) => seq('{l', repeat($.listitem), '}'),
    listitem: ($) => seq('{', $.list_marker, optional(choice(repeat($._block), repeat($._inline))), '}'),
    comment: (_) => seq('{%', /([^{}]|\\\}|\\\{)+/, '}'),

    heading_content: ($) => repeat1($._inline),

    _inline: ($) => choice($.word, $.softbreak, $.emphasis, $.strong),
    emphasis: ($) => seq('{', $.emphasis_marker, repeat($._inline), '}'),
    strong: ($) => seq('{', $.strong_marker, repeat($._inline), '}'),

    word: (_) => /([^ {}]|\\\{|\\\})+/,
    meta_name: (_) => /([^ {}]|\\\{|\\\})+/,
    softbreak: (_) => '\n',
    list_marker: (_) => token.immediate('-'),
    heading_marker: (_) => token.immediate('#'),
    emphasis_marker: (_) => token.immediate('_'),
    strong_marker: (_) => token.immediate('*'),
  },
});
