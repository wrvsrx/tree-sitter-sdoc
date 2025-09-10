module.exports = grammar({
    name: 'sdoc',

    extras: $ => [
        /[ \t]/, // space and tab are extras
    ],

    externals: $ => [
        $.block_content,
    ],

    rules: {
        document: $ => repeat($._element),

        _element: $ => choice(
            $.block,
            $.text,
            $.newline,
        ),

        block: $ => seq(
            $.block_content
        ),

        text: $ => /[^\n{}]+/, 

        newline: $ => '\n',
    }
});
