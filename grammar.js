module.exports = grammar({
  name: "sdoc",

  extras: ($) => [$._ignored],

  conflicts: (_) => [],

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

    _block: ($) => choice(
      $.paragraph,
      $.list,
      $.heading,
    ),

    paragraph: ($) => seq(repeat1($._inline), $._paragraph_end),
    list: ($) => repeat1($.listitem),
    listitem: ($) => seq(
      $.listmark,
      $._indent_at_here,
      $._block,
      repeat(seq(
        repeat1($.emptyline),
        $._block,
      )),
      repeat($.emptyline),
      $._dedent,
    ),
    heading: ($) => seq(
      $.heading_marker,
      repeat($._inline),
      '\n',
    ),

    _inline: ($) => choice(
      $.str,
      $.softbreak,
      $.emphasis,
    ),
    emphasis: ($) => seq('{*', repeat($._inline), '}'),

    listmark: (_) => token(prec(1, /- +/)),
    heading_marker: (_) => token(prec(1, /# +/)),
    str: (_) => /([^{}\n\\]|\\\{|\\\}|\\)+/,
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
