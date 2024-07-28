module.exports = grammar({
  name: "cfgm",

  rules: {
    document: ($) => repeat($._block),

    _block: ($) => choice($.paragraph),

    paragraph: ($) => choice($._explicit_paragraph, $._implicit_paragraph),
    _explicit_paragraph: ($) => seq('{p', repeat(choice($._none_eol_inline, $.hardbreak, $.softbreak)), 'p}'),
    // 连续的非空行就是 paragraph，后跟大于等于 1 个空行
    _implicit_paragraph: ($) => seq($._nonempty_line, repeat(seq($.softbreak, $._nonempty_line)), $.hardbreak),

    _nonempty_line: ($) => repeat1($._none_eol_inline),

    _none_eol_inline: ($) => choice($.word),

    // tokens
    hardbreak: (_) => /\n\n+/,
    softbreak: (_) => /\n/,
    word: (_) => /\S+/,
  },
});
