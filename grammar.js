module.exports = grammar({
    name: 'sdoc',

    externals: $ => [
        $._standard_s_expression_start,
        $._standard_s_expression_end,
        $._verbatim_end,
        $._verbatim_end,
        $._implicit_paragraph_start,
        $._implicit_paragraph_end,
    ],

    rules: {
        document: $ => repeat($._element),

        _element: $ => choice(
            $.stardard_s_expression,
            $.implicit_paragraph
            $.verbatim,
        ),

        stardard_s_expression: $ => seq(
            $._standard_s_expression_start,
            $.tag,
            repeat($._element),
        ),

        implicit_paragraph: $ => seq(
            $._implicit_paragraph_start,
            repeat($._element),
            $._implicit_paragraph_end
        ),

        verbatim: $ => seq(
            $._verbatim_start,
            repeat($._content),
            $._verbatim_end
        )

        _content: $ => choice(
            $.text,
            $.s_expression
        ),

        tag: $ => /[^\s{}]+/, 
        text: $ => /[^\s{}]+/, 
    }
});
