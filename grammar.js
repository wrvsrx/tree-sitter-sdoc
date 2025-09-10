module.exports = grammar({
    name: 'sdoc',

    extras: $ => [
        /[ \t]/, // space and tab are extra
    ],

    rules: {
        document: $ => repeat($._element),

        _element: $ => choice(
            $.heading_block,
            $.explicit_paragraph_block,
            $.implicit_paragraph,
            $.newline,
        ),

        // An implicit plain text paragraph.
        implicit_paragraph: $ => prec(-1,
            repeat1(choice(
                /[^\\{}\n]+/,
                $.escaped_char,
            ))
        ),

        // Heading block: {# ...} or {heading ...}
        heading_block: $ => seq(
            '{',
            alias(choice('#', 'heading'), $.tag_name),
            repeat($._content),
            '}'
        ),

        // Explicit paragraph block: {p ...} or {paragraph ...}
        explicit_paragraph_block: $ => seq(
            '{',
            alias(choice('p', 'paragraph'), $.tag_name),
            repeat($._content),
            '}'
        ),

        _content: $ => choice(
            // TODO: In the future, this could allow more specific nested blocks.
            $.text_content,
            $.newline,
        ),
        
        text_content: $ => prec.left(repeat1(choice(
            /[^\\{}\n\s]+/,
            $.escaped_char,
        ))),

        escaped_char: $ => token(seq('\\', /./)),

        newline: $ => '\n',
    }
});
