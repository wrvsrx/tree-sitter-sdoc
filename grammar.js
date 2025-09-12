module.exports = grammar({
    name: 'sdoc',

    extras: $ => [/[\s\r\n]/],

    externals: $ => [
        $._standard_s_expression_start,
        $._standard_s_expression_end,
        $._implicit_paragraph_start,
        $._implicit_paragraph_end,
        $._verbatim_start,
        $._verbatim_end,
        $._verbatim_content,
    ],

    rules: {
        document: $ => repeat($._element),

        _element: $ => choice(
            $._s_expression,

            $.text
            $.verbatim,
        ),

        _s_expression: $ => choice(
            $.implicit_paragraph,
            $.explicit_paragraph,
            $.unknown_name_s_expr,
        ),

        explicit_paragraph: $ => seq(
            $._standard_s_expression_start,
            /p|paragraph/,
            /\s+/,
            // paragraph cannot cannot be nested
            repeat(choice($.unknown_name_s_expr, $.text, $.verbatim)),
            $._standard_s_expression_end,
        ),

        unknown_name_s_expr: $ => seq(
            $._standard_s_expression_start,
            $.unknown_tag_name,
            /\s+/,
            repeat($._element),
            $._standard_s_expression_end,
        ),

        implicit_paragraph: $ => seq(
            $._implicit_paragraph_start,
            // paragraph cannot cannot be nested
            repeat(choice($.unknown_name_s_expr, $.text, $.verbatim)),
            $._implicit_paragraph_end
        ),

        verbatim: $ => seq(
            $._verbatim_start,
            $._verbatim_content,
            $._verbatim_end
        ),

        text: $ => repeat1($.character),

        unknown_tag_name: $ => /[^\s{}]+/,
        character: $ => /[^{}]/, 
    }
});
