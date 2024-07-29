module.exports = grammar({
  name: "sdoc",

  rules: {
    document: ($) => repeat($._block),

    _block: ($) => choice($.paragraph),

    paragraph: ($) => seq('{p', repeat($._inline), '}'),

    _inline: ($) => choice($.word, $.softbreak),

    word: (_) => /[^ {}]+/,
    softbreak: (_) => '\n',
  },
});
