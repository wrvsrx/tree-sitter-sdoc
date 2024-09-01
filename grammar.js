module.exports = grammar({
  name: "sdoc",

  extras: ($) => [$._ignored],

  conflicts: ($) => [
    [$._multiple_block],
  ],


  rules: {
    document: ($) => seq(
      repeat($.emptyline),
      optional(seq(
        $._multiple_block,
        // we can have trailing emptylines
        repeat($.emptyline),
      )),
    ),

    _multiple_block: ($) => seq(
      $._block,
      repeat(seq(
        repeat1($.emptyline),
        $._block,
      )),
    ),

    _block: ($) => choice($.paragraph, $.list),

    paragraph: ($) => seq(repeat1($._inline), $._paragraph_end),
    list: ($) => repeat1($.listitem),
    listitem: ($) => seq(
      $.listmark,
      $._indent_at_here,
      $._multiple_block,
      repeat($.emptyline),
      $._dedent,
    ),

    _inline: ($) => choice($.str, $.softbreak),

    listmark: (_) => token(prec(1, /- +/)),
    str: (_) => /.+/,
    _paragraph_end: (_) => '\n',
  },

  externals: ($) => [
    $._ignored,
    $.emptyline,
    $.softbreak,
    $._indent_at_here,
    $._dedent,
  ],
});
