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
      $.inline_verbatim,
      $.inline_math,
    ),
    str: ($) => prec.right(repeat1($._char)),
    emphasis: ($) => seq('_{', repeat($._inline), '}_'),
    strong: ($) => seq('*{', repeat($._inline), '}*'),
    strikethrough: ($) => seq('~{', repeat($._inline), '}~'),
    span: ($) => seq('{', repeat($._inline), '}'),
    inline_verbatim: ($) => seq(
      $.inline_verbatim_start,
      alias(repeat($._inline_verbatim_char), $.inline_verbatim_content),
      $.inline_verbatim_end,
    ),
    inline_math: ($) => seq(
      $.inline_math_start,
      alias(repeat($._inline_math_char), $.inline_math_content),
      $.inline_math_end,
    ),

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

    $.inline_verbatim_start,
    $.inline_verbatim_end,
    $._inline_verbatim_char,

    $.inline_math_start,
    $.inline_math_end,
    $._inline_math_char,
  ],
});
