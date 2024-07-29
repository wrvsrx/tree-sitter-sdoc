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
    heading: ($) => seq('{#', repeat($._inline), '}'),
    list: ($) => seq('{l', repeat($.listitem), '}'),
    listitem: ($) => seq('{-', optional(choice(repeat($._block), repeat($._inline))), '}'),
    comment: (_) => seq('{%', /([^{}]|\\\}|\\\{)+/ , '}'),

    _inline: ($) => choice($.word, $.softbreak),

    word: (_) => /([^ {}]|\\\{|\\\})+/,
    softbreak: (_) => '\n',
  },
});
