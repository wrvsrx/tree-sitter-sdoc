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

    paragraph: ($) => seq(repeat1($._inline), '\n'),

    list: ($) => prec.right(repeat1($.listitem)),
    listitem: ($) => seq(
      $.listitem_marker,
      $._indent_at_here,
      repeat($._block),
      $._dedent,
    ),
    listitem_marker: (_) => /- +/,

    tasklist: ($) => prec.right(repeat1($.tasklistitem)),
    tasklistitem: ($) => seq(
      choice($.tasklistitem_done_marker, $.tasklistitem_todo_marker),
      $._indent_at_here,
      repeat($._block),
      $._dedent,
    ),
    tasklistitem_todo_marker: (_) => /\[ \] +/,
    tasklistitem_done_marker: (_) => /\[x\] +/,
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
      $.span,
    ),
    str: ($) => prec.right(repeat1($._char)),
    emphasis: ($) => seq('_{', repeat($._inline), '}_'),
    strong: ($) => seq('*{', repeat($._inline), '}*'),
    strikethrough: ($) => seq('~{', repeat($._inline), '}~'),
    span: ($) => seq('{', repeat($._inline), '}'),

    heading_marker: (_) => /# +/,
    quote_marker: (_) => /> +/,
    _char: (_) => token(prec(-1, /([^{}\n\\]|\\\{|\\\}|\\)/)),
  },

  externals: ($) => [
    $._ignored,
    $.emptyline,
    $.softbreak,
    $._indent_at_here,
    $._dedent,
  ],
});
