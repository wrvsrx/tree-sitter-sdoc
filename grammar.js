module.exports = grammar({
  name: "sdoc",

  conflicts: ($) => [
    [$._block, $.section],
  ],

  rules: {
    document: ($) => repeat($._block),

    _block: ($) => choice($.paragraph, $.section, $.heading, $.list, $.comment),

    paragraph: ($) => seq('{p', repeat($._inline), '}'),
    section: ($) => seq('{|', optional($.heading), repeat($._block), '}'),
    heading: ($) => seq('{', $.heading_marker, optional($.heading_content), '}'),
    list: ($) => seq('{l', repeat($.listitem), '}'),
    listitem: ($) => seq('{', $.list_marker, optional(choice(repeat($._block), repeat($._inline))), '}'),
    comment: (_) => seq('{%', /([^{}]|\\\}|\\\{)+/, '}'),

    heading_content: ($) => repeat1($._inline),

    _inline: ($) => choice($.word, $.softbreak),

    word: (_) => /([^ {}]|\\\{|\\\})+/,
    softbreak: (_) => '\n',
    list_marker: (_) => token.immediate('-'),
    heading_marker: (_) => token.immediate('#'),
  },
});
