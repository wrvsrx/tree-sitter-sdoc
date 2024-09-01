module.exports = grammar({
  name: "sdoc",

  extras: ($) => [$._ignored],

  conflicts: (_) => [],

  rules: {
    document: ($) => repeat($._block),

    _block: ($) => choice(
      $.paragraph,
      $.list,
      $.heading,
      $.emptyline,
      $.quote,
    ),

    paragraph: ($) => seq(repeat1($._inline), $._paragraph_end),
    list: ($) => prec.right(repeat1($.listitem)),
    listitem: ($) => seq(
      $.listitem_marker,
      $._indent_at_here,
      repeat($._block),
      $._dedent,
    ),
    heading: ($) => seq(
      $.heading_marker,
      repeat($._inline),
      '\n',
    ),
    quote: ($) => seq(
      $.quote_marker,
      $._indent_at_here,
      repeat($._block),
      $._dedent,
    ),

    _inline: ($) => choice(
      $.str,
      $.softbreak,
      $.emphasis,
    ),
    emphasis: ($) => seq('{*', repeat($._inline), '}'),

    listitem_marker: (_) => token(prec(1, /- +/)),
    heading_marker: (_) => token(prec(1, /# +/)),
    quote_marker: (_) => token(prec(1, /> +/)),
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
