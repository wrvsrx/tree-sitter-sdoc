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
            $.list_block, // Added list_block
            $.implicit_paragraph,
            $.newline,
        ),

        implicit_paragraph: $ => prec(-1,
            repeat1(choice(
                /[^\\{}\n]+/,
                $.escaped_char,
            ))
        ),

        heading_block: $ => seq(
            '{',
            alias(choice('#', 'heading'), $.tag_name),
            repeat($._text_content), // Headings contain text
            '}'
        ),

        explicit_paragraph_block: $ => seq(
            '{',
            alias(choice('p', 'paragraph'), $.tag_name),
            repeat($._text_content), // Explicit paragraphs contain text
            '}'
        ),

        list_block: $ => seq(
            '{',
            alias(choice('l', 'list'), $.tag_name),
            repeat(choice($.item_block, $.newline)),
            '}'
        ),

        item_block: $ => seq(
            '{',
            alias(choice('*', 'item'), $.tag_name),
            repeat($._block_content), // List items can contain other blocks
            '}'
        ),

        // Defines what content can be inside a text-only block
        _text_content: $ => choice(
            $.text_content,
            $.newline,
        ),

        // Defines what content can be inside a block that allows nesting
        _block_content: $ => choice(
            $.list_block, // nesting lists
            $.explicit_paragraph_block,
            $.heading_block,
            $.text_content,
            $.newline
        ),
        
        text_content: $ => prec.left(repeat1(choice(
            /[^\\{}\n\s]+/,
            $.escaped_char,
        ))),

        escaped_char: $ => token(seq('\\', /./)),

        newline: $ => '\n',
    }
});
