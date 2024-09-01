module.exports = grammar({
  name: "sdoc",

  extras: (_) => [],

  rules: {
    document: ($) => seq(
      repeat($.emptyline),
      optional(seq(
        $._block,
        repeat(seq(
          repeat1($.emptyline),
          $._block,
        )),
        // we can have trailing emptylines
        repeat($.emptyline),
      )),
    ),

    _block: ($) => choice($.paragraph, $.list),

    paragraph: ($) => seq(repeat1($._inline), $._paragraph_end),
    list: ($) => repeat1(seq(/- +/, $.paragraph)),

    _inline: ($) => choice($.str, $.softbreak),

    str: (_) => /.+/,
    _paragraph_end: (_) => '\n',
  },

  externals: ($) => [
    $.emptyline,
    $.softbreak,
  ],
});
