module.exports = grammar({
    name: 'sdoc',

    extras: $ => [/[\s\r\n]/],

    externals: $ => [
        $._standard_s_expression_start,
        $._standard_s_expression_end,
        $._verbatim_start,
        $._verbatim_end,
        $._verbatim_content,
        $._implicit_paragraph_start,
        $._implicit_paragraph_end,
    ],

    rules: {
        document: $ => repeat($._element),

        _element: $ => choice(
            $.verbatim,
            $.implicit_paragraph,

            // inline
            $.character

            $.unknown_name_s_expr,
        ),

        unknown_name_s_expr: $ => seq(
            $._standard_s_expression_start,
            $.tag,
            repeat($._element),
            $._standard_s_expression_end,
        ),

        implicit_paragraph: $ => seq(
            $._implicit_paragraph_start,
            // implicit paragraphs cannot cannot be nested
            repeat(choice($.verbatim, $.character, $.unknown_name_s_expr)),
            $._implicit_paragraph_end
        ),

        verbatim: $ => seq(
            $._verbatim_start,
            $._verbatim_content,
            $._verbatim_end
        ),

        tag: $ => /[^\s{}]+/,
        character: $ => /[^{}]/, 
    }
});
