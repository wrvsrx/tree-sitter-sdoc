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
        $._implicit_paragraph_content,
    ],

    rules: {
        document: $ => repeat($._element),

        _element_without_paragraph: $ => choice(
            $.standard_s_expression,
            $.verbatim,
            $.text
        ),

        _element: $ => choice(
            $._element_without_paragraph,
            $.implicit_paragraph,
        ),

        standard_s_expression: $ => seq(
            $._standard_s_expression_start,
            $.tag,
            repeat($._element),
            $._standard_s_expression_end,
        ),

        implicit_paragraph: $ => seq(
            $._implicit_paragraph_start,
            // implicit paragraphs cannot cannot be nested
            repeat($._element_without_paragraph),
            $._implicit_paragraph_end
        ),

        verbatim: $ => seq(
            $._verbatim_start,
            $._verbatim_content,
            $._verbatim_end
        ),

        tag: $ => /[^\s{}]+/,
        text: $ => /[^\n{}]+/, 
    }
});
