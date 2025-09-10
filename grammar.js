module.exports = grammar({
    name: 'sdoc',

    extras: $ => [
        /[ \t]/, // Allow space and tab as implicit whitespace
    ],

    externals: $ => [
        $._block_start, // Handled by the external scanner
        $._block_end,   // Handled by the external scanner
    ],

    rules: {
        document: $ => repeat($._element),

        _element: $ => choice(
            $.block,              // A fenced block like {tag ...} or {{{tag ...}}}
            $.implicit_paragraph, // Any line of text that is not a block
            $.newline             // Explicit newlines between elements
        ),

        implicit_paragraph: $ => prec(-1,repeat1(
          choice(
            /[^\n{}]+/,
            /\\}/, // allow single '}' that doesn't form a valid block_end
          )
        )),

        block: $ => seq(
            $._block_start,
            $.tag_name,
            repeat($._content),
            $._block_end
        ),

        _content: $ => choice(
            $.block,  // Allow nested blocks
            $.text,   // Allow text content
            $.newline // Allow newlines
        ),

        tag_name: $ => /[a-zA-Z0-9_#*]+/, 

        text: $ => /[^\n{}\\]+/,

        newline: $ => '\n',
    }
});
