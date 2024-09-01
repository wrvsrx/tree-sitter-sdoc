module.exports = grammar({
  name: "sdoc",

  extras: ($) => [$._ignored],

  conflicts: (_) => [],

  rules: {
    document: ($) => repeat($._block),

    _block: ($) => choice(
      $.paragraph,
      $.list,
      $.tasklist,
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
    tasklist: ($) => prec.right(repeat1($.tasklistitem)),
    tasklistitem: ($) => seq(
      choice($.tasklistitem_done_marker, $.tasklistitem_todo_marker),
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
      $.strong,
      $.strikethrough,
    ),
    emphasis: ($) => seq('{_', repeat($._inline), '}'),
    strong: ($) => seq('{*', repeat($._inline), '}'),
    strikethrough: ($) => seq('{~', repeat($._inline), '}'),

    listitem_marker: (_) => token(prec(1, /- +/)),
    tasklistitem_todo_marker: (_) => token(prec(1, '[ ]')),
    tasklistitem_done_marker: (_) => token(prec(1, '[x]')),
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
