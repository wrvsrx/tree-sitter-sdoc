module.exports = grammar({
    name: 'sdoc',

    extras: $ => [
        /[ \t]/, // space and tab are extra
    ],

    rules: {
        document: $ => repeat(
            choice(
                $.block_element,
                $.paragraph,
                $.newline,
            )
        ),

        // A plain text paragraph. It has a low precedence to not conflict with block elements.
        paragraph: $ => prec(-1,
            repeat1(choice(
                /[^\\{}\n]+/,
                $.escaped_char,
            ))
        ),

        block_element: $ => seq(
            '{',
            $.tag_name,
            repeat($._content),
            '}'
        ),

        _content: $ => choice(
            $.block_element,
            $.text_content,
            $.newline,
        ),
        
        text_content: $ => prec.left(repeat1(choice(
            /[^\\{}\n\s]+/,
            $.escaped_char,
        ))),

        tag_name: $ => /[a-zA-Z][a-zA-Z0-9_]*/,

        escaped_char: $ => token(seq('\\', /./)),

        newline: $ => '\n',
    }
});
